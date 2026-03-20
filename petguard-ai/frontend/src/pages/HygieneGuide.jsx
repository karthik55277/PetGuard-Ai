import React, { useMemo, useState } from 'react';
import { Sparkles, Droplets, PawPrint, SunMedium, Leaf, ShieldAlert } from 'lucide-react';

const guides = [
  {
    id: 'dog-bathing',
    title: 'Dog Bathing',
    category: 'Grooming',
    species: 'dog',
    image:
      'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Safe, calm bath time routine to keep your dog clean without stressing their skin or joints.',
    steps: [
      'Brush your dog to remove mats before getting them wet.',
      'Place a non‑slip mat in the tub or bathing area.',
      'Use lukewarm water and thoroughly wet the coat, avoiding direct spray into ears and eyes.',
      'Lather a pet‑safe shampoo, massaging gently down to the skin.',
      'Rinse until the water runs completely clear with no shampoo residue.',
      'Towel‑dry and, if using a dryer, keep it on low heat and at a distance.',
    ],
    warning:
      'Never use human shampoo on dogs. If your pet has open wounds, hot spots, or is extremely stressed, skip home baths and contact a vet or professional groomer.',
  },
  {
    id: 'cat-cleaning',
    title: 'Cat Cleaning',
    category: 'Grooming',
    species: 'cat',
    image:
      'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Gentle spot-cleaning and coat care tailored to cats, who usually groom themselves.',
    steps: [
      'Use a soft brush to remove loose fur and small tangles.',
      'Spot‑clean dirty areas with a slightly damp cloth or pet‑safe wipe.',
      'Only bathe if absolutely necessary and use a cat‑specific shampoo.',
      'Keep sessions short and calm, offering breaks if your cat is anxious.',
      'Dry thoroughly with a towel, keeping the environment warm and draft‑free.',
    ],
    warning:
      'Forced full baths can be extremely stressful for many cats. If your cat is panicking, panting, or trying to escape aggressively, stop and contact a vet or fear‑free groomer for guidance.',
  },
  {
    id: 'tick-removal',
    title: 'Tick Removal',
    category: 'Parasite Prevention',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210490/pexels-photo-7210490.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Careful tick removal to reduce the risk of infection or leaving mouthparts in the skin.',
    steps: [
      'Wear disposable gloves if available and part the fur around the tick.',
      'Use fine‑tipped tweezers or a tick tool to grasp the tick as close to the skin as possible.',
      'Pull upward with slow, steady pressure—do not twist or crush the tick.',
      'Place the tick in a sealed container or tape for identification if needed.',
      'Clean the bite area and your hands with soap and water or antiseptic.',
      'Monitor the site for redness, swelling, or pain over the next few days.',
    ],
    warning:
      'Do not burn the tick, apply alcohol, or use petroleum jelly while it is attached—these methods can increase disease transmission. If the mouthparts remain or your pet seems unwell, see a vet promptly.',
  },
  {
    id: 'ear-cleaning',
    title: 'Ear Cleaning',
    category: 'Health & Skin Care',
    species: 'both',
    image:
      'https://images.pexels.com/photos/5731901/pexels-photo-5731901.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Routine ear checks and gentle cleaning to prevent infections and discomfort.',
    steps: [
      'Visually inspect the outer ear for redness, discharge, or strong odor.',
      'Use a vet‑approved ear cleaner—never water, vinegar, or hydrogen peroxide unless prescribed.',
      'Fill the ear canal as directed and gently massage the base of the ear for 20–30 seconds.',
      'Allow your pet to shake their head, then wipe away loosened debris from the outer ear with gauze or cotton pads.',
      'Repeat on the other ear if needed and reward your pet for cooperation.',
    ],
    warning:
      'Do not insert cotton swabs or any object deep into the ear canal. If you see blood, black debris, or your pet is in pain, skip home cleaning and go straight to your vet.',
  },
  {
    id: 'nail-trimming',
    title: 'Nail Trimming',
    category: 'Grooming',
    species: 'both',
    image:
      'https://images.pexels.com/photos/4298619/pexels-photo-4298619.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Keep nails short and comfortable with slow, positive trimming sessions.',
    steps: [
      'Use sharp, pet‑specific nail clippers or a grinder.',
      'Identify the quick (pink inner area) in light nails and trim just before it.',
      'For dark nails, trim tiny slivers at a time and stop if you see a gray or pink dot in the center.',
      'Hold each paw gently and pair every few nails with a treat break.',
      'If you accidentally cut the quick, apply styptic powder or cornstarch with pressure.',
    ],
    warning:
      'If your pet is highly fearful, thrashing, or has very overgrown or curled nails, attempting a full trim at home can cause injury. In these cases, book a vet or groomer visit.',
  },
  {
    id: 'dental-care',
    title: 'Dental Care',
    category: 'Health & Skin Care',
    species: 'both',
    image:
      'https://images.pexels.com/photos/5731919/pexels-photo-5731919.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Daily or weekly mouth care to reduce bad breath, plaque, and gum disease risk.',
    steps: [
      'Start by gently lifting your pet’s lips and touching the outer teeth for a few seconds, then reward.',
      'Introduce a pet‑safe toothpaste and let your pet lick it from your finger or a brush.',
      'Brush the outer surfaces of the teeth using small circular motions, focusing on the gum line.',
      'Aim for short, frequent sessions rather than long, stressful ones.',
      'Combine brushing with vet‑approved dental chews or rinses if recommended.',
    ],
    warning:
      'Never use human toothpaste—fluoride and xylitol can be toxic to pets. If you notice heavy tartar, loose teeth, or bleeding gums, schedule a professional dental exam.',
  },
  {
    id: 'coat-brushing',
    title: 'Coat Brushing',
    category: 'Grooming',
    species: 'both',
    image:
      'https://images.pexels.com/photos/8916046/pexels-photo-8916046.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Daily or weekly brushing reduces shedding, prevents mats, and keeps the skin healthy.',
    steps: [
      'Choose a brush type suited to your pet’s coat (slicker, bristle, undercoat rake, etc.).',
      'Start with short sessions, brushing in the direction of hair growth.',
      'Work in small sections, gently untangling knots without pulling the skin.',
      'Pay attention to friction areas like behind ears, armpits, and under the collar.',
      'Reward your pet frequently to build a positive association.',
    ],
    warning:
      'If you discover tight mats close to the skin, do not cut them out with scissors—one slip can cause serious injury. Seek professional grooming help for severe matting.',
  },
  {
    id: 'paw-care',
    title: 'Paw Care',
    category: 'Environment Hygiene',
    species: 'both',
    image:
      'https://images.pexels.com/photos/4587996/pexels-photo-4587996.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Keep paws clean and protected from rough surfaces, hot pavements, and debris.',
    steps: [
      'After walks, inspect each paw pad and between toes for stones, burrs, or cuts.',
      'Gently wipe paws with a damp cloth or pet‑safe wipe to remove dirt and road salt.',
      'Trim long fur between toes if it traps debris or forms ice balls in winter.',
      'Use a vet‑approved paw balm if pads are dry or cracked.',
    ],
    warning:
      'Avoid using harsh chemicals or human lotions on paw pads. If you see limping, swelling, or persistent licking, have your vet check for injury or infection.',
  },
  {
    id: 'eye-cleaning',
    title: 'Eye Cleaning',
    category: 'Health & Skin Care',
    species: 'both',
    image:
      'https://images.pexels.com/photos/2123773/pexels-photo-2123773.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Gentle eye-area cleaning to manage tear stains and minor discharge.',
    steps: [
      'Use a soft, damp cotton pad or cloth—one for each eye.',
      'Wipe from the inner corner outward, using a fresh section of the pad each time.',
      'Keep hair around the eyes neatly trimmed if recommended by your groomer or vet.',
    ],
    warning:
      'Redness, squinting, thick discharge, or pawing at the eyes can signal infection or injury. Do not use eye drops without veterinary guidance—see your vet promptly.',
  },
  {
    id: 'bedding-hygiene',
    title: 'Bedding Hygiene',
    category: 'Environment Hygiene',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210300/pexels-photo-7210300.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Fresh, clean bedding reduces odors, parasites, and skin irritation.',
    steps: [
      'Vacuum or shake out pet beds at least weekly to remove fur and dust.',
      'Wash removable covers in hot water using a pet‑safe, fragrance‑free detergent.',
      'Dry completely before use to prevent mold and dampness.',
      'Rotate and inspect beds for wear, broken zippers, or exposed stuffing.',
    ],
    warning:
      'Strong fragrances and fabric softeners can irritate sensitive skin and noses. Choose gentle, unscented products and rinse thoroughly.',
  },
  {
    id: 'odor-control',
    title: 'Odor Control',
    category: 'Environment Hygiene',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210530/pexels-photo-7210530.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Combine cleaning routines and ventilation to keep pet spaces smelling fresh.',
    steps: [
      'Clean litter boxes, puppy pads, or toilet areas daily.',
      'Wash food and water bowls frequently to prevent buildup and slime.',
      'Air out rooms and open windows when safe to reduce lingering odors.',
      'Use pet‑safe enzymatic cleaners on accidents instead of simple deodorizers.',
    ],
    warning:
      'Avoid strong air fresheners, incense, and essential oil diffusers around pets—many fragrances can irritate airways or be toxic, especially for cats and birds.',
  },
  {
    id: 'toilet-training',
    title: 'Toilet Training',
    category: 'Toilet Training',
    species: 'dog',
    image:
      'https://images.pexels.com/photos/7210590/pexels-photo-7210590.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Consistent routines help puppies and new dogs learn where to toilet.',
    steps: [
      'Take your dog to the chosen toilet area after waking, eating, playing, and before bed.',
      'Use a cue word while they are toileting and reward immediately afterward.',
      'Supervise indoors and interrupt quietly if they start to go inside—guide them outside.',
      'Clean indoor accidents with enzymatic cleaner to remove all scent markers.',
    ],
    warning:
      'Never punish or rub your dog’s nose in accidents; this damages trust and delays learning. If housetraining suddenly regresses, check with your vet for medical causes.',
  },
  {
    id: 'skin-allergies',
    title: 'Skin Care & Allergies',
    category: 'Health & Skin Care',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210516/pexels-photo-7210516.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Support healthy skin and recognize early allergy signs.',
    steps: [
      'Regularly inspect the skin for redness, bumps, hair loss, or scabs.',
      'Keep a log of flare‑ups and note foods, environments, or seasons that coincide.',
      'Use only vet‑recommended shampoos and topical products on sensitive skin.',
    ],
    warning:
      'Persistent itching, chewing, or open sores should not be managed with home remedies alone. Seek veterinary advice to rule out infections, mites, or food allergies.',
  },
  {
    id: 'parasite-prevention',
    title: 'Parasite Prevention',
    category: 'Parasite Prevention',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210593/pexels-photo-7210593.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Use a vet‑guided prevention plan to protect against fleas, ticks, and worms.',
    steps: [
      'Discuss year‑round parasite prevention options with your veterinarian.',
      'Give preventatives on schedule and set reminders so doses are not missed.',
      'Dispose of feces promptly in your yard and litter box to reduce reinfection.',
      'Check your pet’s coat after walks in tall grass or wooded areas.',
    ],
    warning:
      'Never share dog products with cats or vice versa—some ingredients are deadly for the wrong species. If you suspect an overdose, contact a vet or emergency poison hotline immediately.',
  },
  {
    id: 'seasonal-hygiene',
    title: 'Seasonal Hygiene',
    category: 'Seasonal Care',
    species: 'both',
    image:
      'https://images.pexels.com/photos/7210273/pexels-photo-7210273.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    description: 'Adjust routines for shedding seasons, heat, rain, and cold weather.',
    steps: [
      'Increase brushing during spring and fall shedding to reduce loose fur and matting.',
      'After rainy or snowy walks, dry your pet thoroughly, especially between toes and skin folds.',
      'In summer, avoid hot pavement and provide shaded rest areas with fresh water.',
      'In winter, rinse paws after contact with de‑icing salts and chemicals.',
    ],
    warning:
      'Heatstroke and hypothermia can progress quickly. Panting heavily, weakness, or disorientation in heat—or shivering, stiffness, and lethargy in cold—require immediate veterinary attention.',
  },
];

import { useGamification } from '../components/GamificationProvider';
import { useToast } from '../components/ToastProvider';

const HygieneCard = ({ guide, isExpanded, onToggle }) => {
  const { awardForHygieneTask } = useGamification();
  const { notify } = useToast();

  const handleComplete = () => {
    awardForHygieneTask();
    notify({
      type: 'success',
      title: 'Hygiene task logged',
      message: 'Nice work keeping your pet clean! Points awarded.',
    });
  };
  return (
    <article
      className="group flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all duration-200"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={guide.image}
          alt={guide.title}
          className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        <h2 className="absolute bottom-3 left-4 text-lg font-semibold text-white drop-shadow-md">
          {guide.title}
        </h2>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-600">
            <Sparkles className="w-3 h-3 text-primary-500" />
            {guide.category}
          </p>
          <p className="text-[11px] font-medium text-slate-500">
            {guide.species === 'both' ? 'Dog & Cat' : guide.species === 'dog' ? 'Dog' : 'Cat'} care
          </p>
        </div>

        <p className="text-sm text-slate-600 mb-4 flex-1">{guide.description}</p>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center justify-center w-full text-sm font-medium rounded-xl px-4 py-2.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100 transition-colors"
        >
          {isExpanded ? 'Hide Steps' : 'View Steps'}
        </button>

        {isExpanded && (
          <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <ol className="space-y-3">
              {guide.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                  Important safety tip
                </p>
              </div>
              <p className="text-sm text-amber-800">{guide.warning}</p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Mark as completed
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

const HygieneGuide = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [speciesFilter, setSpeciesFilter] = useState('all'); // all | dog | cat

  const filteredGuides = useMemo(
    () =>
      guides.filter((g) =>
        speciesFilter === 'all' ? true : speciesFilter === g.species || g.species === 'both'
      ),
    [speciesFilter]
  );

  const categories = useMemo(
    () => Array.from(new Set(filteredGuides.map((g) => g.category))),
    [filteredGuides]
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Pet Hygiene <span className="text-primary-600">Guides</span>
        </h1>
        <p className="text-slate-600 text-sm">
          Practical, step‑by‑step routines for everyday care. Use these as general guidance and always
          follow your veterinarian&apos;s specific instructions for your pet.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'dog', label: 'Dog' },
            { id: 'cat', label: 'Cat' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSpeciesFilter(option.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                speciesFilter === option.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {option.id === 'dog' && <PawPrint className="w-3 h-3 text-primary-500" />}
              {option.id === 'cat' && <SunMedium className="w-3 h-3 text-primary-500" />}
              {option.id === 'all' && <Leaf className="w-3 h-3 text-primary-500" />}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {categories.map((category) => (
        <section key={category} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
              {category}
            </h2>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredGuides
              .filter((guide) => guide.category === category)
              .map((guide) => (
                <HygieneCard
                  key={guide.id}
                  guide={guide}
                  isExpanded={expandedId === guide.id}
                  onToggle={() =>
                    setExpandedId((current) => (current === guide.id ? null : guide.id))
                  }
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HygieneGuide;
