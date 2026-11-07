/* MasterQuiz Final — single-file app
   - 10 levels
   - 15 questions per level (randomly drawn from questionPool)
   - Unlocked when score >= 80%
   - Background music with mute/unmute toggle (requires user gesture to play)
   - Sound FX for correct/wrong/time-up (toggleable)
   - Shuffle questions on every start
*/

const LEVEL_COUNT = 10;
const QUESTIONS_PER_LEVEL = 15;
const UNLOCK_THRESHOLD = 80; // percent
const PER_QUESTION_TIME = 15; // seconds

// small built-in question pool (you can replace using the import textarea)
// For brevity, includes the earlier 30-question set + 30 placeholder questions to allow sampling.
let builtInPool = [
  {
    q: "A car accelerates uniformly from rest to 20 m/s in 5 s. What is the distance covered in the last second?",
    options: ["20 m", "18 m", "14 m", "12 m"],
    answerIndex: 2,
  },
  {
    q: "An object is projected at an angle of 45° with an initial velocity of 20 m/s. Calculate its maximum height.",
    options: ["5.1 m", "10.2 m", "15.3 m", "20.4 m"],
    answerIndex: 1,
  },
  {
    q: "What is the acceleration of a freely falling body near the Earth's surface?",
    options: ["8.9 m/s²", "9.8 m/s²", "10.0 m/s²", "9.0 m/s²"],
    answerIndex: 1,
  },
  {
    q: "A body of mass 5 kg is acted upon by a force of 20 N. Find its acceleration.",
    options: ["4 m/s²", "2 m/s²", "5 m/s²", "10 m/s²"],
    answerIndex: 0,
  },
  {
    q: "When a sound wave travels through air, what is actually transferred?",
    options: ["Air particles", "Sound energy", "Light energy", "Heat"],
    answerIndex: 1,
  },
  {
    q: "Which of these materials is a good conductor of electricity?",
    options: ["Plastic", "Copper", "Glass", "Wood"],
    answerIndex: 1,
  },
  {
    q: "Which process involves change of a solid directly to vapour?",
    options: ["Evaporation", "Condensation", "Sublimation", "Melting"],
    answerIndex: 2,
  },
  {
    q: "When calcium reacts with water, the gas evolved is:",
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"],
    answerIndex: 0,
  },
  {
    q: "The atomic number of an element represents the number of:",
    options: [
      "Protons",
      "Neutrons",
      "Electrons + Neutrons",
      "Protons + Neutrons",
    ],
    answerIndex: 0,
  },
  {
    q: "What is the SI unit of electric current?",
    options: ["Ampere", "Coulomb", "Volt", "Ohm"],
    answerIndex: 0,
  },
  {
    q: "Which organelle is responsible for energy production in cells?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
    answerIndex: 2,
  },
  {
    q: "In photosynthesis, the gas used up by plants is:",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    answerIndex: 1,
  },
  {
    q: "Which of the following is a vector-borne disease?",
    options: ["Tuberculosis", "Malaria", "Cholera", "Tetanus"],
    answerIndex: 1,
  },
  {
    q: "If sin θ = 3/5, find cos θ.",
    options: ["4/5", "5/3", "3/4", "2/3"],
    answerIndex: 0,
  },
  {
    q: "Solve for x: 2x + 3 = 11.",
    options: ["3", "4", "5", "6"],
    answerIndex: 1,
  },

  {
    q: "A car accelerates uniformly from rest to 20 m/s in 5 s. What is the distance covered in the last second?",
    options: ["20 m", "18 m", "14 m", "12 m"],
    answerIndex: 2,
  },
  {
    q: "An object is projected at an angle of 45° with an initial velocity of 20 m/s. Calculate its maximum height.",
    options: ["5.1 m", "10.2 m", "15.3 m", "20.4 m"],
    answerIndex: 1,
  },
  {
    q: "What is the acceleration of a freely falling body near the Earth's surface?",
    options: ["8.9 m/s²", "9.8 m/s²", "10.0 m/s²", "9.0 m/s²"],
    answerIndex: 1,
  },
  {
    q: "A body of mass 5 kg is acted upon by a force of 20 N. Find its acceleration.",
    options: ["4 m/s²", "2 m/s²", "5 m/s²", "10 m/s²"],
    answerIndex: 0,
  },
  {
    q: "When a sound wave travels through air, what is actually transferred?",
    options: ["Air particles", "Sound energy", "Light energy", "Heat"],
    answerIndex: 1,
  },
  {
    q: "A machine whose velocity ratio is 5 has an efficiency of 80%. Find its mechanical advantage.",
    options: ["4.0", "3.5", "4.5", "5.0"],
    answerIndex: 0,
  },
  {
    q: "A ray of light passes from air into glass. The angle of incidence is 30° and the refractive index is 1.5. Find the angle of refraction.",
    options: ["19.5°", "20.0°", "22.0°", "25.0°"],
    answerIndex: 0,
  },
  {
    q: "Which of the following is not a vector quantity?",
    options: ["Force", "Displacement", "Speed", "Velocity"],
    answerIndex: 2,
  },
  {
    q: "A uniform meter rule is balanced at its center. If a 40 g mass is hung at 10 cm, where should a 60 g mass be hung to balance it?",
    options: ["60 cm", "40 cm", "30 cm", "70 cm"],
    answerIndex: 0,
  },
  {
    q: "If the potential difference across a resistor is 12 V and the current is 3 A, calculate its resistance.",
    options: ["2 Ω", "3 Ω", "4 Ω", "6 Ω"],
    answerIndex: 2,
  },
  {
    q: "Which of these materials is a good conductor of electricity?",
    options: ["Plastic", "Copper", "Glass", "Wood"],
    answerIndex: 1,
  },
  {
    q: "When calcium reacts with water, the gas evolved is:",
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"],
    answerIndex: 0,
  },
  {
    q: "The atomic number of an element represents the number of:",
    options: [
      "Protons",
      "Neutrons",
      "Electrons + Neutrons",
      "Protons + Neutrons",
    ],
    answerIndex: 0,
  },
  {
    q: "The oxidation number of oxygen in H₂O₂ is:",
    options: ["0", "+1", "-1", "-2"],
    answerIndex: 2,
  },
  {
    q: "Which process involves change of a solid directly to vapour?",
    options: ["Evaporation", "Condensation", "Sublimation", "Melting"],
    answerIndex: 2,
  },
  {
    q: "When dilute hydrochloric acid reacts with sodium hydroxide, the products are:",
    options: ["Salt and water", "Salt only", "Water only", "Gas and water"],
    answerIndex: 0,
  },
  {
    q: "Which of the following gases turns limewater milky?",
    options: ["Carbon dioxide", "Oxygen", "Hydrogen", "Nitrogen"],
    answerIndex: 0,
  },
  {
    q: "Which of the following elements is a noble gas?",
    options: ["Oxygen", "Nitrogen", "Argon", "Hydrogen"],
    answerIndex: 2,
  },
  {
    q: "What is the pH of a neutral solution?",
    options: ["0", "7", "14", "1"],
    answerIndex: 1,
  },
  {
    q: "Which of these processes is exothermic?",
    options: ["Evaporation", "Melting", "Freezing", "Sublimation"],
    answerIndex: 2,
  },
  {
    q: "Which organelle is responsible for energy production in cells?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
    answerIndex: 2,
  },
  {
    q: "In photosynthesis, the gas used up by plants is:",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    answerIndex: 1,
  },
  {
    q: "Which of the following is a vector-borne disease?",
    options: ["Tuberculosis", "Malaria", "Cholera", "Tetanus"],
    answerIndex: 1,
  },
  {
    q: "Which part of the human brain controls balance?",
    options: ["Cerebrum", "Cerebellum", "Medulla", "Pons"],
    answerIndex: 1,
  },
  {
    q: "The outermost part of a plant cell is the:",
    options: ["Cell wall", "Cell membrane", "Cytoplasm", "Nucleus"],
    answerIndex: 0,
  },
  {
    q: "Which of these animals is cold-blooded?",
    options: ["Dog", "Bird", "Frog", "Goat"],
    answerIndex: 2,
  },
  {
    q: "Which vitamin is produced in the skin by sunlight?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    answerIndex: 3,
  },
  {
    q: "If sin θ = 3/5, find cos θ.",
    options: ["4/5", "5/3", "3/4", "2/3"],
    answerIndex: 0,
  },
  {
    q: "Solve for x: 2x + 3 = 11.",
    options: ["3", "4", "5", "6"],
    answerIndex: 1,
  },
  {
    q: "Simplify: (2x² × 3x³).",
    options: ["6x⁵", "5x⁶", "6x⁶", "5x⁵"],
    answerIndex: 0,
  },

  {
    q: "Find the gradient of the line passing through the points (2, 3) and (6, 11).",
    options: ["1", "2", "3", "4"],
    answerIndex: 1,
  },
  {
    q: "Evaluate 3⁻² × 3⁴.",
    options: ["3²", "3⁶", "3⁻⁶", "3"],
    answerIndex: 0,
  },
  {
    q: "If 4x − 7 = 9, find x.",
    options: ["1", "2", "3", "4"],
    answerIndex: 3,
  },
  {
    q: "A body is thrown vertically upward with speed 20 m/s. Find the maximum height reached (take g = 10 m/s²).",
    options: ["15 m", "20 m", "25 m", "30 m"],
    answerIndex: 2,
  },
  {
    q: "What is the efficiency of a machine that does 800 J of useful work when 1000 J of energy is supplied?",
    options: ["60 %", "70 %", "80 %", "90 %"],
    answerIndex: 2,
  },
  {
    q: "Which law states that pressure is directly proportional to temperature at constant volume?",
    options: [
      "Boyle’s law",
      "Charles’ law",
      "Gay-Lussac’s law",
      "Avogadro’s law",
    ],
    answerIndex: 2,
  },
  {
    q: "An electric iron rated 1000 W, 250 V is used for 1 hour. How much energy is consumed?",
    options: ["1 kWh", "2 kWh", "3 kWh", "4 kWh"],
    answerIndex: 0,
  },
  {
    q: "Which property of a wave determines its loudness?",
    options: ["Frequency", "Amplitude", "Wavelength", "Speed"],
    answerIndex: 1,
  },
  {
    q: "The instrument used to measure potential difference is called:",
    options: ["Ammeter", "Voltmeter", "Galvanometer", "Thermometer"],
    answerIndex: 1,
  },
  {
    q: "A block of mass 2 kg moves with velocity 5 m/s. Find its kinetic energy.",
    options: ["10 J", "15 J", "20 J", "25 J"],
    answerIndex: 2,
  },
  {
    q: "What is the main constituent of natural gas?",
    options: ["Methane", "Ethane", "Propane", "Butane"],
    answerIndex: 0,
  },
  {
    q: "Which of these is a chemical change?",
    options: [
      "Melting of ice",
      "Dissolving of salt",
      "Burning of paper",
      "Breaking of glass",
    ],
    answerIndex: 2,
  },
  {
    q: "Which gas is used in the preparation of soda water?",
    options: ["Nitrogen", "Carbon dioxide", "Hydrogen", "Oxygen"],
    answerIndex: 1,
  },
  {
    q: "What is the pH of an acid solution?",
    options: ["Less than 7", "Equal to 7", "Greater than 7", "Zero"],
    answerIndex: 0,
  },
  {
    q: "Which of the following is an example of an alkali?",
    options: ["NaOH", "HCl", "H₂SO₄", "CH₃COOH"],
    answerIndex: 0,
  },
  {
    q: "Which element is used in the vulcanization of rubber?",
    options: ["Sulphur", "Phosphorus", "Nitrogen", "Carbon"],
    answerIndex: 0,
  },
  {
    q: "What is the chemical formula for washing soda?",
    options: ["Na₂CO₃·10H₂O", "NaHCO₃", "CaCO₃", "NaCl"],
    answerIndex: 0,
  },
  {
    q: "The process of coating iron with zinc is called:",
    options: ["Alloying", "Galvanization", "Electroplating", "Soldering"],
    answerIndex: 1,
  },
  {
    q: "Which gas is evolved when dilute HCl reacts with zinc?",
    options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
    answerIndex: 1,
  },
  {
    q: "Which of these is a renewable energy source?",
    options: ["Coal", "Petroleum", "Solar", "Natural gas"],
    answerIndex: 2,
  },
  {
    q: "Which part of the human body controls breathing rate?",
    options: ["Cerebrum", "Cerebellum", "Medulla oblongata", "Spinal cord"],
    answerIndex: 2,
  },
  {
    q: "The functional unit of the kidney is the:",
    options: ["Neuron", "Nephron", "Alveolus", "Atrium"],
    answerIndex: 1,
  },
  {
    q: "Which of the following is not a characteristic of living things?",
    options: ["Growth", "Respiration", "Photosynthesis", "Decay"],
    answerIndex: 3,
  },
  {
    q: "In humans, which organ secretes bile?",
    options: ["Liver", "Pancreas", "Stomach", "Gall bladder"],
    answerIndex: 0,
  },
  {
    q: "Which group of organisms have no true nucleus?",
    options: ["Bacteria", "Fungi", "Protists", "Plants"],
    answerIndex: 0,
  },
  {
    q: "Which blood cells help in clotting?",
    options: ["Red cells", "White cells", "Platelets", "Plasma"],
    answerIndex: 2,
  },
  {
    q: "What is the equation of a straight line with gradient 3 and intercept –2?",
    options: ["y = 3x – 2", "y = 2x – 3", "y = –2x + 3", "y = x + 3"],
    answerIndex: 0,
  },
  {
    q: "Simplify 2(x – 3) + 4x.",
    options: ["2x – 6 + 4x", "6x – 6", "4x + 6", "x – 6"],
    answerIndex: 1,
  },
  {
    q: "Find the value of y if 3y + 2 = 11.",
    options: ["2", "3", "4", "5"],
    answerIndex: 2,
  },
  {
    q: "The mean of 5, 10, 15, 20 is:",
    options: ["10", "12.5", "15", "20"],
    answerIndex: 1,
  },
  {
    q: "Find the median of the numbers 4, 7, 9, 10, 15.",
    options: ["7", "8", "9", "10"],
    answerIndex: 2,
  },
  {
    q: "Simplify: (x²y³) × (x³y⁴).",
    options: ["x⁵y⁷", "x⁶y⁶", "x⁵y⁶", "x⁶y⁷"],
    answerIndex: 0,
  },
  {
    q: "If 3x = 12, find the value of x.",
    options: ["2", "3", "4", "5"],
    answerIndex: 2,
  },
  {
    q: "Evaluate: 2(5 + 3)².",
    options: ["64", "128", "16", "80"],
    answerIndex: 0,
  },
  {
    q: "The sides of a triangle are 3 cm, 4 cm, and 5 cm. What is its area?",
    options: ["6 cm²", "12 cm²", "9 cm²", "10 cm²"],
    answerIndex: 0,
  },
  {
    q: "Find the volume of a cube whose edge is 4 cm.",
    options: ["16 cm³", "32 cm³", "64 cm³", "128 cm³"],
    answerIndex: 2,
  },
  {
    q: "The sum of angles in a triangle is:",
    options: ["90°", "120°", "180°", "360°"],
    answerIndex: 2,
  },
  {
    q: "A car moves at 60 km/h for 2 hours. What distance does it cover?",
    options: ["100 km", "120 km", "150 km", "180 km"],
    answerIndex: 1,
  },
  {
    q: "Find the simple interest on ₦5000 at 10% per annum for 2 years.",
    options: ["₦500", "₦1000", "₦1500", "₦2000"],
    answerIndex: 1,
  },
  {
    q: "Which quantity is measured in Newtons?",
    options: ["Mass", "Weight", "Energy", "Power"],
    answerIndex: 1,
  },
  {
    q: "What is the force required to accelerate a 10 kg mass at 2 m/s²?",
    options: ["5 N", "10 N", "15 N", "20 N"],
    answerIndex: 3,
  },
  {
    q: "The image formed by a plane mirror is always:",
    options: ["Real", "Inverted", "Virtual and erect", "Magnified"],
    answerIndex: 2,
  },
  {
    q: "Which colour of light has the shortest wavelength?",
    options: ["Red", "Violet", "Green", "Yellow"],
    answerIndex: 1,
  },
  {
    q: "Which of the following is a non-renewable energy source?",
    options: ["Solar", "Wind", "Petroleum", "Hydro"],
    answerIndex: 2,
  },
  {
    q: "The process of separating a mixture of salt and sand involves:",
    options: [
      "Filtration and evaporation",
      "Distillation only",
      "Sublimation only",
      "Crystallization only",
    ],
    answerIndex: 0,
  },
  {
    q: "Which of the following has a metallic bond?",
    options: ["Sodium", "Sulphur", "Phosphorus", "Carbon"],
    answerIndex: 0,
  },
  {
    q: "Which of the following gases is diatomic?",
    options: ["Neon", "Oxygen", "Helium", "Argon"],
    answerIndex: 1,
  },
  {
    q: "The process by which green plants make their food is:",
    options: ["Respiration", "Photosynthesis", "Transpiration", "Germination"],
    answerIndex: 1,
  },
  {
    q: "Which of these blood vessels carries blood away from the heart?",
    options: ["Veins", "Arteries", "Capillaries", "Venules"],
    answerIndex: 1,
  },
  {
    q: "The part of the human eye that controls the amount of light entering is the:",
    options: ["Cornea", "Iris", "Lens", "Retina"],
    answerIndex: 1,
  },
  {
    q: "Which of these is a communicable disease?",
    options: ["Diabetes", "Malaria", "Cancer", "Ulcer"],
    answerIndex: 1,
  },
  {
    q: "Which type of joint is found in the shoulder?",
    options: ["Hinge", "Ball and socket", "Pivot", "Gliding"],
    answerIndex: 1,
  },
  {
    q: "Which of the following organisms is a producer?",
    options: ["Goat", "Lion", "Grass", "Frog"],
    answerIndex: 2,
  },
  {
    q: "Which of the following is used for measuring temperature?",
    options: ["Barometer", "Hygrometer", "Thermometer", "Anemometer"],
    answerIndex: 2,
  },
  {
    q: "The energy stored in food is:",
    options: [
      "Kinetic energy",
      "Chemical energy",
      "Heat energy",
      "Solar energy",
    ],
    answerIndex: 1,
  },
  {
    q: "The quantity of heat required to raise the temperature of 1 kg of water by 1°C is:",
    options: ["1 J", "4.2 J", "4.2 kJ", "42 J"],
    answerIndex: 2,
  },
  {
    q: "Which of these particles has a negative charge?",
    options: ["Proton", "Electron", "Neutron", "Photon"],
    answerIndex: 1,
  },
  {
    q: "In the equation PV = constant, P represents:",
    options: ["Pressure", "Power", "Potential", "Photon energy"],
    answerIndex: 0,
  },
  {
    q: "A magnet attracts which of the following materials?",
    options: ["Copper", "Iron", "Aluminium", "Silver"],
    answerIndex: 1,
  },
  {
    q: "The rate of doing work is called:",
    options: ["Energy", "Force", "Power", "Momentum"],
    answerIndex: 2,
  },
  {
    q: "Which of the following instruments is used to measure electric current?",
    options: ["Voltmeter", "Ammeter", "Ohmmeter", "Galvanometer"],
    answerIndex: 1,
  },
  {
    q: "A conductor allows current to flow easily because it has:",
    options: [
      "Few free electrons",
      "Many free electrons",
      "High resistance",
      "Low potential",
    ],
    answerIndex: 1,
  },
  {
    q: "The SI unit of resistance is:",
    options: ["Volt", "Ampere", "Ohm", "Coulomb"],
    answerIndex: 2,
  },
  {
    q: "The chemical symbol for sodium is:",
    options: ["S", "N", "Na", "So"],
    answerIndex: 2,
  },
  {
    q: "Which of the following is an alkali metal?",
    options: ["Calcium", "Potassium", "Iron", "Copper"],
    answerIndex: 1,
  },
  {
    q: "The process of heating an ore in the absence of air is called:",
    options: ["Roasting", "Calcination", "Smelting", "Reduction"],
    answerIndex: 1,
  },
  {
    q: "Which of these gases turns limewater milky?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Ammonia"],
    answerIndex: 1,
  },
  {
    q: "The atomic number of an element represents the number of:",
    options: [
      "Neutrons",
      "Protons",
      "Electrons + Neutrons",
      "Protons + Neutrons",
    ],
    answerIndex: 1,
  },
  {
    q: "The smallest particle of a compound that can exist independently is called a:",
    options: ["Atom", "Ion", "Molecule", "Electron"],
    answerIndex: 2,
  },
  {
    q: "The main constituent of natural gas is:",
    options: ["Ethane", "Propane", "Methane", "Butane"],
    answerIndex: 2,
  },
  {
    q: "Which organ in humans removes nitrogenous waste?",
    options: ["Liver", "Lungs", "Kidney", "Heart"],
    answerIndex: 2,
  },
  {
    q: "The basic unit of life is the:",
    options: ["Tissue", "Organ", "Cell", "System"],
    answerIndex: 2,
  },
  {
    q: "The part of a plant that anchors it to the ground is the:",
    options: ["Stem", "Root", "Leaf", "Flower"],
    answerIndex: 1,
  },
  {
    q: "Which of these organisms undergo metamorphosis?",
    options: ["Lizard", "Toad", "Cow", "Pigeon"],
    answerIndex: 1,
  },
  {
    q: "The organ responsible for pumping blood is the:",
    options: ["Liver", "Lung", "Heart", "Kidney"],
    answerIndex: 2,
  },
  {
    q: "Which of the following is a hereditary material?",
    options: ["RNA", "DNA", "Protein", "Fat"],
    answerIndex: 1,
  },
  {
    q: "Which organelle is responsible for respiration in cells?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
    answerIndex: 2,
  },
  {
    q: "In plants, photosynthesis occurs in the:",
    options: ["Root", "Stem", "Leaf", "Flower"],
    answerIndex: 2,
  },
  {
    q: "The exchange of gases in plants takes place through the:",
    options: ["Xylem", "Stomata", "Phloem", "Root hairs"],
    answerIndex: 1,
  },
  {
    q: "The Earth completes one rotation about its axis in:",
    options: ["12 hours", "24 hours", "30 days", "365 days"],
    answerIndex: 1,
  },
  {
    q: "The Earth’s satellite is the:",
    options: ["Sun", "Moon", "Star", "Planet"],
    answerIndex: 1,
  },
  {
    q: "The innermost layer of the Earth is called the:",
    options: ["Mantle", "Core", "Crust", "Lithosphere"],
    answerIndex: 1,
  },
  {
    q: "Which of these planets is known as the Red Planet?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    answerIndex: 2,
  },
  {
    q: "Which instrument is used to measure atmospheric pressure?",
    options: ["Thermometer", "Barometer", "Hygrometer", "Rain gauge"],
    answerIndex: 1,
  },
  {
    q: "Which of these is a gaseous pollutant?",
    options: ["Carbon monoxide", "Lead", "Dust", "Smoke"],
    answerIndex: 0,
  },
  {
    q: "What is the major constituent of air?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answerIndex: 1,
  },
  {
    q: "Which of the following is responsible for day and night?",
    options: [
      "Revolution of Earth",
      "Rotation of Earth",
      "Orbit of Moon",
      "Motion of Sun",
    ],
    answerIndex: 1,
  },
  {
    q: "Which of the following types of rocks is formed from cooling of molten magma?",
    options: ["Sedimentary", "Metamorphic", "Igneous", "Alluvial"],
    answerIndex: 2,
  },
  {
    q: "The hardest natural substance known is:",
    options: ["Iron", "Quartz", "Diamond", "Gold"],
    answerIndex: 2,
  },
  {
    q: "Which of these phenomena occurs due to refraction of light?",
    options: ["Rainbow", "Echo", "Shadow", "Mirage"],
    answerIndex: 3,
  },
  {
    q: "A car travels 100 km in 2 hours. What is its average speed?",
    options: ["25 km/h", "50 km/h", "75 km/h", "100 km/h"],
    answerIndex: 1,
  },
  {
    q: "The unit of power is:",
    options: ["Joule", "Newton", "Watt", "Volt"],
    answerIndex: 2,
  },
  {
    q: "Which of the following is a vector quantity?",
    options: ["Mass", "Speed", "Velocity", "Energy"],
    answerIndex: 2,
  },
  {
    q: "A simple machine that changes the direction of a force is called a:",
    options: ["Lever", "Inclined plane", "Pulley", "Wheel and axle"],
    answerIndex: 2,
  },
  {
    q: "The pressure at a point in a liquid depends on the liquid’s:",
    options: ["Volume", "Mass", "Density", "Surface area"],
    answerIndex: 2,
  },
  {
    q: "Which of the following elements is a halogen?",
    options: ["Chlorine", "Oxygen", "Nitrogen", "Carbon"],
    answerIndex: 0,
  },
  {
    q: "Which process separates a mixture based on differences in boiling points?",
    options: ["Filtration", "Evaporation", "Distillation", "Sublimation"],
    answerIndex: 2,
  },
  {
    q: "An atom that gains or loses electrons is called a:",
    options: ["Molecule", "Isotope", "Ion", "Compound"],
    answerIndex: 2,
  },
  {
    q: "The pH of a neutral solution is:",
    options: ["0", "1", "7", "14"],
    answerIndex: 2,
  },
  {
    q: "Which gas is used in the preparation of soda water?",
    options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
    answerIndex: 2,
  },
  {
    q: "Which part of the human body controls balance?",
    options: ["Cerebellum", "Cerebrum", "Medulla", "Spinal cord"],
    answerIndex: 0,
  },
  {
    q: "The sense organ responsible for detecting light is the:",
    options: ["Ear", "Eye", "Nose", "Tongue"],
    answerIndex: 1,
  },
  {
    q: "The exchange of gases in humans occurs in the:",
    options: ["Bronchi", "Trachea", "Alveoli", "Lungs"],
    answerIndex: 2,
  },
  {
    q: "Which blood cells help in fighting diseases?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
    answerIndex: 1,
  },
  {
    q: "Which vitamin is produced when the skin is exposed to sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
    answerIndex: 2,
  },
  {
    q: "The process of removing waste products from the body is called:",
    options: ["Digestion", "Circulation", "Excretion", "Respiration"],
    answerIndex: 2,
  },
  {
    q: "The part of the flower that produces pollen grains is the:",
    options: ["Stigma", "Anther", "Ovary", "Style"],
    answerIndex: 1,
  },
  {
    q: "Which of the following planets has rings around it?",
    options: ["Earth", "Venus", "Saturn", "Mars"],
    answerIndex: 2,
  },
  {
    q: "The distance between two successive crests of a wave is its:",
    options: ["Amplitude", "Frequency", "Wavelength", "Period"],
    answerIndex: 2,
  },
  {
    q: "The speed of light in air is approximately:",
    options: ["3 × 10⁵ m/s", "3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁸ m/s"],
    answerIndex: 3,
  },
  {
    q: "A current of 2 A flows through a 3 Ω resistor. The potential difference is:",
    options: ["1.5 V", "3 V", "6 V", "9 V"],
    answerIndex: 2,
  },
  {
    q: "Which element has the chemical symbol Fe?",
    options: ["Fluorine", "Iron", "Lead", "Tin"],
    answerIndex: 1,
  },
  {
    q: "The process of rusting involves:",
    options: [
      "Oxygen and water",
      "Hydrogen and salt",
      "Carbon dioxide only",
      "Heat only",
    ],
    answerIndex: 0,
  },
  {
    q: "Which metal is liquid at room temperature?",
    options: ["Mercury", "Iron", "Aluminium", "Copper"],
    answerIndex: 0,
  },
  {
    q: "Which of these is a noble gas?",
    options: ["Nitrogen", "Neon", "Oxygen", "Hydrogen"],
    answerIndex: 1,
  },
  {
    q: "Which of the following organisms causes malaria?",
    options: ["Virus", "Plasmodium", "Bacteria", "Protozoa"],
    answerIndex: 1,
  },
  {
    q: "The organ responsible for filtering blood in humans is the:",
    options: ["Liver", "Heart", "Kidney", "Lungs"],
    answerIndex: 2,
  },
  {
    q: "Which of these organisms is a vertebrate?",
    options: ["Cockroach", "Frog", "Earthworm", "Butterfly"],
    answerIndex: 1,
  },
  {
    q: "The green pigment in leaves is called:",
    options: ["Chlorophyll", "Carotene", "Haemoglobin", "Melanin"],
    answerIndex: 0,
  },
  {
    q: "Which of these is a scalar quantity?",
    options: ["Force", "Velocity", "Speed", "Momentum"],
    answerIndex: 2,
  },

  // --- filler placeholders to allow levels of 15 each ---
];

// Add filler auto-generated questions if pool is small
for (let i = builtInPool.length + 1; i <= 120; i++) {
  builtInPool.push({
    q: "Placeholder extra question " + i,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answerIndex: 0,
  });
}

let questionPool = builtInPool.slice(); // copy, can be replaced by import

// UI elements
const levelGrid = document.getElementById("levelGrid");
const quizCard = document.getElementById("quizCard");
const levelsCard = document.getElementById("levelsCard");
const resultCard = document.getElementById("resultCard");
const levelBadge = document.getElementById("levelBadge");
const timerBar = document.getElementById("timerBar");
const timerText = document.getElementById("timerText");
const questionArea = document.getElementById("questionArea");
const qCount = document.getElementById("qCount");
const nextBtn = document.getElementById("nextBtn");
const quitBtn = document.getElementById("quitBtn");
const backBtn = document.getElementById("backBtn");
const retryBtn = document.getElementById("retryBtn");
const resultText = document.getElementById("resultText");

const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const fxBtn = document.getElementById("fxBtn");
const btnLevels = document.getElementById("btnLevels");
const btnHome = document.getElementById("btnHome");
const importArea = document.getElementById("importArea");
const importBtn = document.getElementById("importBtn");
const resetPoolBtn = document.getElementById("resetPoolBtn");

let audioCtx = null;
let fxOn = true;
let musicOn = false;

// sound functions
function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Audio unavailable");
    }
  }
}
function playTone(freq, dur = 0.12, type = "sine", gain = 0.12) {
  if (!fxOn) return;
  ensureAudio();
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  setTimeout(() => {
    try {
      o.stop();
    } catch (e) {}
  }, dur * 1000 + 20);
}
function soundCorrect() {
  playTone(880, 0.12, "sine", 0.14);
  setTimeout(() => playTone(1320, 0.08, "sine", 0.08), 80);
}
function soundWrong() {
  playTone(160, 0.28, "sawtooth", 0.16);
}
function soundTime() {
  playTone(220, 0.18, "sine", 0.12);
  setTimeout(() => playTone(440, 0.25, "sine", 0.08), 160);
}
function soundClick() {
  playTone(600, 0.06, "square", 0.06);
}

// state
let unlockedCount = parseInt(localStorage.getItem("mq_unlocked") || "1", 10);
if (isNaN(unlockedCount)) unlockedCount = 1;

let currentLevel = null;
let currentQuestions = [];
let currentQIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = PER_QUESTION_TIME;

// helpers
function saveUnlocked(n) {
  localStorage.setItem("mq_unlocked", String(n));
  unlockedCount = n;
}
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// build level grid
function renderLevels() {
  levelGrid.innerHTML = "";
  for (let i = 1; i <= LEVEL_COUNT; i++) {
    const div = document.createElement("div");
    div.className = "level-tile";
    const isUnlocked = i <= unlockedCount;
    if (isUnlocked) div.classList.add("unlocked");
    else div.classList.add("locked");
    div.innerHTML = `<div class="level-title">Level ${i}</div><div class="level-sub">${QUESTIONS_PER_LEVEL} questions</div><div class="lock-icon">${
      isUnlocked ? "🔓" : "🔒"
    }</div>`;
    if (isUnlocked) {
      div.addEventListener("click", () => {
        ensureAudio();
        startLevel(i - 1);
        soundClick();
      });
    }
    levelGrid.appendChild(div);
  }
}

function startLevel(levelIdx) {
  currentLevel = levelIdx;
  score = 0;
  currentQIndex = 0;
  // draw QUESTIONS_PER_LEVEL random questions from pool (shuffle pool first)
  const pool = shuffleArray(questionPool.slice());
  currentQuestions = pool.slice(0, QUESTIONS_PER_LEVEL);
  // ensure questions shuffled on start
  currentQuestions = shuffleArray(currentQuestions);
  levelBadge.textContent = "Level " + (levelIdx + 1);
  levelsCard.style.display = "none";
  resultCard.classList.add("hidden");
  quizCard.style.display = "flex";
  renderQuestion();
}

function renderQuestion() {
  const qObj = currentQuestions[currentQIndex];
  questionArea.innerHTML = `<div class="question"><strong>${
    currentQIndex + 1
  }.</strong> ${qObj.q}</div><div class="options"></div>`;
  const opts = questionArea.querySelector(".options");
  // shuffle options display but track original answer
  const order = [0, 1, 2, 3];
  shuffleArray(order);
  // store mapping
  qObj._displayOrder = order;
  qObj._correctDisplayIndex = order.indexOf(qObj.answerIndex);
  order.forEach((oi, idx) => {
    const d = document.createElement("div");
    d.className = "option";
    d.textContent = String.fromCharCode(65 + idx) + ". " + qObj.options[oi];
    d.addEventListener("click", () => chooseOption(d, idx));
    opts.appendChild(d);
  });
  nextBtn.disabled = true;
  qCount.textContent = `${currentQIndex + 1}/${QUESTIONS_PER_LEVEL}`;
  startTimer(PER_QUESTION_TIME);
}

function chooseOption(el, displayIdx) {
  stopTimer();
  const qObj = currentQuestions[currentQIndex];
  const opts = document.querySelectorAll(".option");
  opts.forEach((o) => {
    o.classList.add("disabled");
    o.style.pointerEvents = "none";
  });
  if (displayIdx === qObj._correctDisplayIndex) {
    el.classList.add("correct");
    score++;
    soundCorrect();
  } else {
    el.classList.add("wrong");
    if (opts[qObj._correctDisplayIndex])
      opts[qObj._correctDisplayIndex].classList.add("correct");
    soundWrong();
  }
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  soundClick();
  currentQIndex++;
  if (currentQIndex >= currentQuestions.length) {
    finishLevel();
  } else {
    renderQuestion();
  }
});

quitBtn.addEventListener("click", () => {
  stopTimer();
  quizCard.style.display = "none";
  levelsCard.style.display = "block";
  renderLevels();
});

backBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  levelsCard.style.display = "block";
  renderLevels();
});

retryBtn.addEventListener("click", () => {
  startLevel(currentLevel);
});

function finishLevel() {
  stopTimer();
  quizCard.style.display = "none";
  resultCard.classList.remove("hidden");
  const percent = Math.round((score / QUESTIONS_PER_LEVEL) * 100);
  resultText.innerHTML = `You scored <strong>${score}/${QUESTIONS_PER_LEVEL}</strong> — <strong>${percent}%</strong>.`;
  // unlock next if threshold met
  if (percent >= UNLOCK_THRESHOLD) {
    const next = currentLevel + 2;
    if (next > unlockedCount && next <= LEVEL_COUNT) {
      saveUnlocked(next);
      resultText.innerHTML +=
        " <em>Congratulations — next level unlocked!</em>";
      soundCorrect();
    }
  } else {
    soundWrong();
  }
  renderLevels();
}

// Timer functions
function startTimer(seconds) {
  stopTimer();
  timeLeft = seconds;
  const total = seconds;
  timerBar.style.width = "100%";
  updateTimerVisual();
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      // time up
      const opts = document.querySelectorAll(".option");
      const qObj = currentQuestions[currentQIndex];
      opts.forEach((o) => {
        o.classList.add("disabled");
        o.style.pointerEvents = "none";
      });
      if (opts[qObj._correctDisplayIndex])
        opts[qObj._correctDisplayIndex].classList.add("correct");
      timerText.textContent = "Time up!";
      soundTime();
      nextBtn.disabled = false;
      setTimeout(() => {
        currentQIndex++;
        if (currentQIndex >= currentQuestions.length) finishLevel();
        else renderQuestion();
      }, 1200);
      stopTimer();
      return;
    }
    const pct = Math.max(0, Math.round((timeLeft / total) * 100));
    timerBar.style.width = pct + "%";
    updateTimerVisual();
    if (timeLeft === 3) playTone(880, 0.08, "sine", 0.06);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerVisual() {
  const total = PER_QUESTION_TIME;
  const pct = Math.max(0, timeLeft / total);
  const hue = Math.round(pct * 120); // 0..120
  timerBar.style.backgroundColor = `hsl(${hue}deg 70% 40%)`;
  timerText.textContent = `Time left: ${timeLeft}s`;
}

// controls
muteBtn.addEventListener("click", () => {
  if (!musicOn) {
    // try to start music
    bgMusic
      .play()
      .then(() => {
        musicOn = true;
        muteBtn.textContent = "Mute";
      })
      .catch(() => {
        musicOn = false;
        alert(
          "Browser requires a user gesture to start audio. Click any level to initialize."
        );
      });
  } else {
    bgMusic.pause();
    musicOn = false;
    muteBtn.textContent = "Unmute";
  }
});

fxBtn.addEventListener("click", () => {
  fxOn = !fxOn;
  fxBtn.textContent = fxOn ? "FX On" : "FX Off";
});

btnLevels.addEventListener("click", () => {
  quizCard.style.display = "none";
  resultCard.classList.add("hidden");
  levelsCard.style.display = "block";
  renderLevels();
});
btnHome.addEventListener("click", () => {
  quizCard.style.display = "none";
  resultCard.classList.add("hidden");
  levelsCard.style.display = "block";
  renderLevels();
});

// Import questions
importBtn.addEventListener("click", () => {
  const txt = importArea.value.trim();
  if (!txt) return alert("Paste JSON into textarea first.");
  try {
    const arr = JSON.parse(txt);
    if (!Array.isArray(arr)) throw new Error("Not an array");
    // quick validation
    for (const it of arr) {
      if (
        typeof it.q !== "string" ||
        !Array.isArray(it.options) ||
        typeof it.answerIndex !== "number"
      )
        throw new Error("Invalid format");
    }
    questionPool = arr.slice();
    alert("Custom question pool loaded. Pool size: " + questionPool.length);
  } catch (e) {
    alert("Invalid JSON: " + e.message);
  }
});

resetPoolBtn.addEventListener("click", () => {
  questionPool = builtInPool.slice();
  importArea.value = "";
  alert("Reset to built-in pool.");
});

// initial render
renderLevels();
levelsCard.style.display = "block";
quizCard.style.display = "none";
resultCard.classList.add("hidden");

// expose a global helper for debugging
window.__mq = { questionPool, startLevel };
