export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">À propos d'OrthoVision</h1>
      
      <div className="prose prose-lg prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          OrthoVision est une plateforme expérimentale d'aide au diagnostic orthopédique basée sur le Deep Learning, spécialisée dans l'analyse des radiographies de la cheville.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">L'Objectif Médical</h2>
        <p className="text-slate-600 mb-6">
          Les fractures de la cheville (malléolaires) sont très fréquentes et leur classification précise est cruciale pour déterminer le traitement adéquat (orthopédique vs chirurgical). Ce projet vise à automatiser cette classification pour assister les radiologues et urgentistes.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Les 7 Classes Pris en Charge</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { name: "Weber A", desc: "Fracture de la fibula sous la syndesmose." },
            { name: "Weber B", desc: "Fracture au niveau de la syndesmose." },
            { name: "Weber C", desc: "Fracture au-dessus de la syndesmose." },
            { name: "Bimalléolaire", desc: "Fracture des deux malléoles (interne et externe)." },
            { name: "Trimalléolaire", desc: "Bimalléolaire + fracture du tubercule postérieur du tibia." },
            { name: "Maisonneuve", desc: "Fracture proximale de la fibula associée à une lésion de la cheville." },
            { name: "Ostéochondrale", desc: "Lésion du cartilage et de l'os sous-jacent du dôme talien." }
          ].map((cls, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-1">{cls.name}</h3>
              <p className="text-sm text-slate-500">{cls.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">La Technologie</h2>
        <p className="text-slate-600">
          L'architecture repose sur un réseau de neurones convolutifs (CNN) de type <strong>ResNet50</strong> implémenté avec PyTorch. Le modèle est servi via une API haute performance <strong>FastAPI</strong>, et l'interface que vous utilisez actuellement est construite avec <strong>Next.js</strong> et <strong>TailwindCSS</strong> pour une expérience utilisateur optimale.
        </p>
      </div>
    </main>
  );
}
