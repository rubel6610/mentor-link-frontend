"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CalendarDays, Clock3, LoaderCircle, Search, Sparkles, Wallet, BookOpen, CheckCircle, CreditCard, Banknote } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type PayoutStatus = "PENDING" | "PAID";

type AdminBooking = {
  id: number;
  scheduledAt: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  payoutStatus?: PayoutStatus;
  note: string | null;
  student: { id: number; name: string; email: string };
  tutorProfile: { id: number; user: { id: number; name: string; email: string } };
};

const statusTone: Record<BookingStatus, string> = {
  PENDING: "border-orange-200 bg-orange-50 text-orange-700",
  CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const AdminBookingsPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { token } = useAuth();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${baseUrl}/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed");
        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch {
        await Swal.fire({ icon: "error", title: "Failed to load bookings", confirmButtonColor: "#e11d48" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [baseUrl, token]);

  const handleUpdatePayment = async (id: number, paymentStatus: PaymentStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${baseUrl}/admin/bookings/${id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update payment");
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, paymentStatus } : b));
      await Swal.fire({ icon: "success", title: "Payment updated", timer: 1500, showConfirmButton: false });
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Update failed", text: e.message });
    } finally { setUpdatingId(null); }
  };

  const handleProcessPayout = async (id: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${baseUrl}/admin/bookings/${id}/payout`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to process payout");
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, payoutStatus: "PAID" } : b));
      await Swal.fire({ icon: "success", title: "Payout processed", timer: 1500, showConfirmButton: false });
    } catch (e: any) {
      await Swal.fire({ icon: "error", title: "Payout failed", text: e.message });
    } finally { setUpdatingId(null); }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = [b.student.name, b.tutorProfile.user.name].join(" ").toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === "ALL" || b.status === statusFilter);
  });

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <LoaderCircle className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm text-slate-600">Loading bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-orange-500 p-6 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Booking Management
        </div>
        <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
        <p className="mt-2 text-sm text-emerald-50/90">Monitor all platform session bookings.</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or tutor..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${statusFilter === s ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-400">No bookings match your filters.</div>
        ) : filtered.map((b) => (
          <div key={b.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="font-semibold text-slate-900">Booking #{b.id}</h3>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusTone[b.status]}`}>{b.status}</span>
              {b.paymentStatus && <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Payment: {b.paymentStatus}</span>}
            </div>
            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-500" />Student: {b.student.name}</div>
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-sky-500" />Tutor: {b.tutorProfile.user.name}</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-500" />{new Date(b.scheduledAt).toLocaleString()}</div>
              <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-emerald-500" />{b.duration} min</div>
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-emerald-500" />${b.totalPrice.toFixed(2)}</div>
            </div>
            {b.note && <p className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-500">{b.note}</p>}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-50 pt-4">
              {b.paymentStatus !== "PAID" && (
                <Button
                  onClick={() => handleUpdatePayment(b.id, "PAID")}
                  disabled={updatingId === b.id}
                  className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <CreditCard className="mr-2 h-3.5 w-3.5" />
                  Mark Paid
                </Button>
              )}
              {b.status === "COMPLETED" && b.payoutStatus !== "PAID" && (
                <Button
                  onClick={() => handleProcessPayout(b.id)}
                  disabled={updatingId === b.id}
                  className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Banknote className="mr-2 h-3.5 w-3.5" />
                  Process Payout
                </Button>
              )}
              {b.payoutStatus === "PAID" && (
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" /> Payout Completed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
