import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, scale } from "motion/react";



/**
 * HeroLanguages
 * - translations: array of { lang: 'English', text: 'Bezubaan — ...' }
 * - displayDuration: ms each slide is visible before moving to next
 * - animationDuration: ms for enter/exit animation
 *
 * Stops automatically after the last slide.
 */
export default function HeroLanguages({
  displayDuration = 2200,
  animationDuration = 600,
  onFinish
}) {
  const translations = [
    {  text: "Bezubaan — Giving Voice to the Voiceless" },
    {  text: "बेज़ुबान — बिना आवाज़ों को आवाज़ देना" },
    {  text: "বেজুবান — নিরাপরায়দের কণ্ঠ" },
    { text: "Bezubaan — Voz para los sin voz" },
    {  text: "Bezubaan — Donner une voix aux sans-voix" },
    
  ];

  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  
  useEffect(() => {
    if (finished && onFinish){
      onFinish();

    }// stop if already finished

    const timer = setTimeout(() => {
      if (index < translations.length - 1) {
        setIndex((i) => i + 1);
      } else {
        // reached end — mark finished (stop advancing)
        setFinished(true);
      }
    }, displayDuration);

    return () => clearTimeout(timer);
  }, [index, displayDuration, finished, translations.length,onFinish]);

  const current = translations[index];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15,
        delayChildren:0.1
       }, // delay between words
    },
  };

  const wordVariants = {
   hidden: { opacity: 0, x: -10, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  }
  };
  const title="Bezubaan";

  return (
    <section
      id="hero-translations" 
      className="section-container min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6"
    >
      <div className="max-w-3xl w-full text-center">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-wider ">
            Introducing
          </p>
          <motion.h1 initial="hidden"
          variants={containerVariants}

          animate="visible"
        className="text-4xl md:text-6xl font-extrabold text-gray-900 flex flex-wrap justify-center gap-3">
{title.split(" ").map((word, i) => (
        <motion.span key={i} variants={wordVariants}>
          {word}
        </motion.span>
      ))}
          </motion.h1>
        </div>

        <div className="relative h-36 md:h-44 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              // initial={{ opacity: 0, y: 18, scale: 0.98 }}
              // animate={{ opacity: 1, y: 0, scale: 1 }}
              // exit={{ opacity: 0, y: -18, scale: 0.98 }}
              initial="hidden"
    animate="visible"
    exit="hidden"

              variants={containerVariants}
              transition={{ duration: animationDuration / 1000, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
            >
              <div className=" flex flex-wrap justify-center gap-1 backdrop-blur-sm px-6 py-4 rounded-2xl ">

                  {current.text.split(" ").map((word,i)=>(
                    <motion.span key={i} variants={wordVariants}
                    className="text-xl md:text-2xl font-semibold text-gray-800">
                      {word}
                    </motion.span>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* <div className="mt-6 flex items-center justify-center gap-4">
          <div className="text-sm text-gray-600">
            {finished ? (
              <span>Completed ({translations.length} languages)</span>
            ) : (
              <span>
                Showing {index + 1} of {translations.length}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {translations.map((t, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-hidden
              />
            ))}
          </div>
        </div> */}
      </div>
      
    </section>
  );
}
