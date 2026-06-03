import logo from "@/assets/tulip-logo.png";

export function TulipLetterhead() {
  return (
    <div className="border-b-2 border-[var(--teal)] pb-3 mb-4 flex items-center justify-between">
      <img src={logo} alt="Tulip" className="h-16 w-auto" />
      <div className="text-right">
        <div className="text-[var(--teal)] font-bold text-2xl leading-tight">Tulip Superspeciality Hospital</div>
        <div className="text-[10pt] italic text-[var(--coral)]">Where Care Meets Expertise</div>
        <div className="text-[9pt] text-gray-600 mt-1">
          60 Feet Road, Nani Khodiyar Road, Opp. IRIS Hospital, Anand, Gujarat – 388001
        </div>
        <div className="text-[9pt] text-gray-700">
          Emergency: 9090 664 764 &nbsp;|&nbsp; OPD: 9090 673 773 &nbsp;|&nbsp; www.tuliphospital.co
        </div>
      </div>
    </div>
  );
}

export function TulipFooter() {
  return (
    <div className="border-t border-gray-300 pt-2 mt-6 text-[8.5pt] text-gray-500 flex justify-between">
      <span>60 Feet Road, Anand, Gujarat – 388001</span>
      <span>Emergency 9090 664 764 | OPD 9090 673 773</span>
      <span>www.tuliphospital.co</span>
    </div>
  );
}

export function SignatureBlock({ consultant }: { consultant: string }) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-6 text-[10pt]">
      <div>
        <div className="border-t border-gray-400 pt-1 w-48">
          <div className="font-bold">{consultant || "Dr. Himanshu Meghnathi"}</div>
          <div className="italic">MD, DM (Cardiology) Gold Medalist, FSCAI</div>
          <div>Interventional Cardiologist</div>
        </div>
      </div>
      <div className="text-right">
        <div className="border-t border-gray-400 pt-1 w-48 ml-auto">
          <div className="font-bold">Dr. Pruthvirajsinh Puwar</div>
          <div className="italic">MD, DNB Cardiology, FSCAI</div>
          <div>Interventional Cardiologist</div>
        </div>
      </div>
    </div>
  );
}
