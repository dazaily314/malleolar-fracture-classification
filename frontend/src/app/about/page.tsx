const WEBER_CLASSES = [
  {
    name: "Weber A",
    desc: "Fracture de la fibula distale sous le plan articulaire (syndesmose intacte).",
  },
  {
    name: "Weber B",
    desc: "Fracture au niveau du plan articulaire, impliquant souvent la syndesmose.",
  },
  {
    name: "Weber C",
    desc: "Fracture de la fibula au-dessus du plan articulaire avec lésion syndesmotique.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">
        {"À propos d'OrthoVision"}
      </h1>

      <div className="prose prose-lg prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          OrthoVision est une plateforme expérimentale d&apos;aide au diagnostic
          orthopédique basée sur le Deep Learning, spécialisée dans l&apos;analyse
          des radiographies de la cheville.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
          {"L'objectif médical"}
        </h2>
        <p className="text-slate-600 mb-6">
          Les fractures malléolaires sont fréquentes ; la distinction Weber A, B
          ou C guide la prise en charge. Ce projet vise à classifier
          automatiquement ces trois types à partir d&apos;une radiographie, en
          appui aux cliniciens.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
          Les 3 classes Weber
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {WEBER_CLASSES.map((cls) => (
            <div
              key={cls.name}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-1">{cls.name}</h3>
              <p className="text-sm text-slate-500">{cls.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">
          La technologie
        </h2>
        <p className="text-slate-600">
          L&apos;architecture repose sur un réseau de neurones convolutifs (CNN)
          de type <strong>ResNet50</strong> (PyTorch), avec une tête de
          classification à trois sorties. Le modèle est exposé via une API{" "}
          <strong>FastAPI</strong> ; l&apos;interface utilise{" "}
          <strong>Next.js</strong> et <strong>Tailwind CSS</strong>.
        </p>
      </div>
    </main>
  );
}
