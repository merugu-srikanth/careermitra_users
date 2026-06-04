export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT */}
      <div className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border">
          <h2 className="text-3xl font-bold text-orange-500 mb-2">{title}</h2>
          {children}
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-500 to-orange-500 text-white">
        <div className="text-center space-y-4 px-10">
          <h1 className="text-4xl font-bold">🚀 Job Portal</h1>
          <p className="text-white/80">
            Govt Jobs • Alerts • Notifications • Fast Updates
          </p>
        </div>
      </div>
    </div>
  );
}