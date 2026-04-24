function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3">Ughelli Job Connect</h3>
          <p className="text-slate-300">
            Empowering Careers, Building Futures.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-slate-300">ughellijobconnect@gmail.com</p>
          <p className="text-slate-300">09167404311</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Coverage</h4>
          <p className="text-slate-300">Ughelli & Nearby Areas</p>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center py-4 text-sm text-slate-400">
        © 2026 Ughelli Job Connect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
