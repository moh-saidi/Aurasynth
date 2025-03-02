import React, { useState } from 'react';

// Reusable SVG Icon Component
const QuestionIcon: React.FC = () => (
  <svg
    className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

// FAQ Data
const faqItems = [
  {
    question: 'Comment AuraSynth transforme-t-il le texte en musique ?',
    answer:
      'AuraSynth utilise des modèles avancés de traitement du langage naturel (NLP) et d\'apprentissage profond pour analyser le texte, comprendre son humeur et son rythme, et générer des mélodies uniques en conséquence.',
  },
  {
    question: 'Puis-je utiliser AuraSynth pour des projets commerciaux ?',
    answer:
      'Oui, vous pouvez utiliser AuraSynth pour des projets personnels et commerciaux. Cependant, assurez-vous de respecter les conditions de notre licence.',
  },
  {
    question: 'Comment puis-je obtenir de l\'aide ou du support ?',
    answer: (
      <>
        Nous offrons un support dédié pour vous aider à tirer le meilleur parti d'AuraSynth. Vous pouvez nous contacter via notre page de support ou envoyer un e-mail à notre équipe.
        <br />
        <a
          href="#"
          className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
          target="_blank"
          rel="noreferrer"
        >
          Contactez-nous
        </a>{' '}
        pour toute question ou assistance.
      </>
    ),
  },
  {
    question: 'AuraSynth est-il gratuit ?',
    answer: (
      <>
        AuraSynth propose à la fois une version gratuite avec des fonctionnalités de base et une version premium avec des outils avancés. Vous pouvez consulter nos{' '}
        <a
          href="#"
          className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline"
        >
          tarifs
        </a>{' '}
        pour plus de détails.
      </>
    ),
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white text-center">
          Questions fréquemment posées
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-10">
                <h3
                  className="flex items-center justify-between mb-4 text-lg font-medium text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="flex items-center">
                    <QuestionIcon />
                    {item.question}
                  </span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-500 dark:text-gray-400 text-left">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;