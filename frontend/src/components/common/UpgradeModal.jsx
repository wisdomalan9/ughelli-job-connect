function UpgradeModal({
  open,
  close,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold">
          Upgrade Plan
        </h2>

        <p className="mt-3 text-slate-600">
          You have used your 3 free
          applications.
        </p>

        <div className="space-y-3 mt-6">
          <button className="w-full bg-blue-900 text-white py-3 rounded-lg">
            Plus Plan ₦200 (+6)
          </button>

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg">
            Premium ₦500 (+15)
          </button>
        </div>

        <button
          onClick={close}
          className="mt-5 w-full border py-3 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpgradeModal;
