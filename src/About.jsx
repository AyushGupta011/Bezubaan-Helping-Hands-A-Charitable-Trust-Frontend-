import React from "react";
import { Heart, PawPrint, Users, Home, Megaphone } from "lucide-react";

const AboutSection = () => {
  return (
    <section className=" py-16 px-6 md:px-20 flex flex-col gap-20 text-gray-800" id="about">
      <div className="about max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          About <span className="">Bezubaan NGO</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Giving a voice to the voiceless — because compassion is the universal
          language every living being deserves.
        </p>
      </div>

      {/* Mission & Story */}
      <div className="mission gap-10 items-center mb-20">
        <div>
          <h3 className="text-2xl font-semibold text-black mb-3">
            Our Mission
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to create a world where every animal is treated with
            kindness and respect. We work tirelessly to rescue injured animals,
            provide food and shelter, promote adoptions, and raise awareness
            about responsible pet care and animal rights.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-black mb-3">
            Our Story
          </h3>
          <p className="text-gray-700 leading-relaxed">
           It all began when Abhilash Arya, the founder and president, offered a biscuit to a stray dog outside his home in Shahganj. What seemed like a small act of kindness turned into a divine calling. In that dog’s eyes, Abhilash saw something profound — as if the almighty Himself had appeared in the form of an innocent animal, silently handing over a great responsibility.

From that moment on, it was no longer just about one dog — it became a mission for every voiceless soul in Shahganj. Every wounded, abandoned, or hungry animal found a protector, a friend, and a family in him.

This heartfelt journey gave birth to Bezubaan Helping Hands — a movement of compassion, a platform for animal welfare, and a trust that believes:

Every life matters

Service to animals is service to God

Even a little support from you can change their world


Now, the responsibility lies with all of us.
Your small act of kindness can bring a world of difference to the lives of these voiceless beings
          </p>
        </div>
      </div>

      {/* What We Do */}
      <div className="text-center wedo mb-16 flex flex-col">
        <h3 className="text-3xl font-bold text-black mb-6">What We Do</h3>
        <div className="grid wedo-work md:grid-cols-3 gap-8">
          <div className="bg-white wedo-text border-2 border-black p-6 rounded-2xl shadow hover:shadow-lg transition">
            <Heart className="w-10 h-10 text-amber-700 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-black">
              Rescue & Rehabilitation
            </h4>
            <p className="text-gray-600">
              Saving injured, sick, and abandoned animals and providing them
              with medical care, safety, and love.
            </p>
          </div>

          <div className="bg-white wedo-text p-6 border-2 border-black rounded-2xl shadow hover:shadow-lg transition">
            <PawPrint className="w-10 h-10 text-amber-700 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-black">
              Feeding Drives
            </h4>
            <p className="text-gray-600">
              Daily feeding programs for street animals to ensure no animal goes
              hungry or neglected.
            </p>
          </div>

          <div className="bg-white wedo-text p-6 rounded-2xl border-2 border-black shadow hover:shadow-lg transition">
            <Home className="w-10 h-10 text-amber-700 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-black">
              Adoption & Awareness
            </h4>
            <p className="text-gray-600">
              Helping rescued animals find loving homes and educating the
              community about compassion and care.
            </p>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="text-center vision max-w-3xl mx-auto mb-16">
        <h3 className="text-3xl font-bold text-black mb-4">Our Vision</h3>
        <p className="text-gray-700 leading-relaxed">
          To build a compassionate society where no animal is left hungry, hurt,
          or homeless — a world where humans and animals coexist with love,
          empathy, and respect.
        </p>
      </div>

      {/* Join Us */}
      <div className="text-center join-us">
        <h3 className="text-3xl font-bold  text-black mb-3">Join Us</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Every small effort makes a big difference! Whether you feed one stray,
          volunteer your time, or donate to our cause — you become part of a
          mission that changes lives.
        </p>
        <button className=" volun-btn border-2 border-black text-black px-8 py-3 rounded-full text-lg shadow-md transition">
          <h4 className="items-center">Become a Volunteer</h4>
        </button>
      </div>
    </section>
  );
};

export default AboutSection;
