import type { Question } from "@/lib/types";

/**
 * Week 12 — questions generated from questions/Conservation_Geography_Assignments_QA.pdf.
 *
 * Answers verified against the official key in
 * questions/Conservation Geography Week 12 Solutions.pdf (all ten matched the earlier
 * worked-out answers).
 */
export const week12: Question[] = [
  {
    id: "w12-q1",
    question: "“The conditions determined by physical, social, economic and environmental factors or processes which increase the susceptibility of an individual, a community, assets or systems to the impacts of hazards.” is a definition for",
    options: [
      "hazard",
      "exposure",
      "vulnerability",
      "disaster",
    ],
    answer: 2,
    explanation:
      "This is the UNDRR definition of vulnerability. Exposure is merely being located where a hazard can reach you; vulnerability is what makes that exposure damaging.",
  },
  {
    id: "w12-q2",
    question: "The time of flight for LiDAR is 0.00001 sec. Find the distance of the object from the instrument.",
    options: [
      "500 m",
      "1000 m",
      "1500 m",
      "2000 m",
    ],
    answer: 2,
    explanation:
      "The pulse travels to the target and back, so distance = c x t / 2 = (3 x 10^8 m/s x 10^-5 s) / 2 = 3000 / 2 = 1500 m. Forgetting to halve it gives 3000 m, which is not offered.",
  },
  {
    id: "w12-q3",
    question: "Which application of photogrammetry focuses on understanding what is happening in an area rather than measuring quantities?",
    options: [
      "Metric application",
      "Radiometric application",
      "Interpretive application",
      "Fiducial application",
    ],
    answer: 2,
    explanation:
      "Photogrammetry splits into metric (measuring positions, distances, areas) and interpretive (recognising and describing what the imagery shows).",
  },
  {
    id: "w12-q4",
    question: "“A process, phenomenon or human activity that may cause loss of life, injury or other health impacts, property damage, social and economic disruption or environmental degradation.” is a definition for",
    options: [
      "hazard",
      "exposure",
      "vulnerability",
      "disaster",
    ],
    answer: 0,
    explanation:
      "The UNDRR definition of hazard — the potential source of harm. A disaster is what results when that hazard actually overwhelms a vulnerable, exposed community.",
  },
  {
    id: "w12-q5",
    question: "IMU stands for",
    options: [
      "Imperial metering unit",
      "Inertial metering unit",
      "Imperial measurement unit",
      "Inertial measurement unit",
    ],
    answer: 3,
    explanation:
      "Inertial Measurement Unit — accelerometers and gyroscopes that give the sensor's orientation, paired with GNSS for position in airborne LiDAR and photogrammetry.",
  },
  {
    id: "w12-q6",
    question: "Which application of photogrammetry is involved when the area of forest cover or the size of plantation pits is calculated?",
    options: [
      "Interpretive application",
      "Metric application",
      "Oblique application",
      "Passive application",
    ],
    answer: 1,
    explanation:
      "Calculating an area or a size is measurement, so this is the metric application — the counterpart to Q3.",
  },
  {
    id: "w12-q7",
    question: "Which component is essential in a GIS along with hardware and software?",
    options: [
      "Mirror system",
      "Humanware",
      "Shutter speed",
      "Focal length",
    ],
    answer: 1,
    explanation:
      "A GIS is usually taught as hardware, software, data, methods and people (humanware). The other three options are camera properties, not GIS components.",
  },
  {
    id: "w12-q8",
    question: "Which of these uses revealed willingness to pay?",
    options: [
      "market price method",
      "replacement cost method",
      "damage cost avoided method",
      "contingent valuation method",
    ],
    answer: 0,
    explanation:
      "Revealed preference means inferring value from what people actually do: the market price method reads willingness to pay off real transactions. Contingent valuation is the classic STATED preference method (a hypothetical survey), and the replacement/damage-cost methods are cost-based proxies rather than measures of willingness to pay at all.",
  },
  {
    id: "w12-q9",
    question: "Which camera-axis orientation is intentionally tilted between vertical and horizontal?",
    options: [
      "True vertical",
      "Near vertical",
      "Oblique",
      "Fiducial",
    ],
    answer: 2,
    explanation:
      "Oblique photography deliberately tilts the axis. Near vertical is an unintended tilt of a degree or three; fiducial marks are reference marks on the frame, not an orientation.",
  },
  {
    id: "w12-q10",
    question: "Which platform normally uses cameras placed at ground level with a horizontal camera orientation?",
    options: [
      "Space-borne platform",
      "Air-borne platform",
      "Ground-borne platform",
      "Orbital platform",
    ],
    answer: 2,
    explanation:
      "Ground-borne (terrestrial) photogrammetry puts the camera on a tripod or vehicle at ground level, typically looking horizontally at the subject.",
  },
];
