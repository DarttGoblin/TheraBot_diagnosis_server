const express = require('express');
const cors = require('cors');
const pl = require('tau-prolog');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const prologProgram = `
    disease_symptoms(spontaneous_rupture_of_oesophagus, [sudden_severe_chest_pain, difficulty_swallowing, vomiting_with_blood, shock, pain_worsening_with_swallowing, subcutaneous_emphysema, hematemesis, pneumomediastinum]).
    disease_symptoms(oesophagitis, [heartburn, dysphagia, regurgitation, sore_throat_or_hoarseness, pain_while_swallowing, chest_pain_mistaken_for_heart_attack, bitter_taste_in_the_mouth]).
    disease_symptoms(gastric_outlet_obstruction, [nausea, vomiting, abdominal_bloating, projectile_vomiting, epigastric_fullness, loss_of_appetite, dehydration]).
    disease_symptoms(gastritis, [abdominal_pain_or_discomfort, nausea, loss_of_appetite, bloating, vomiting, heartburn]).
    disease_symptoms(gastric_ulcer, [epigastric_pain, nausea, vomiting, pain_after_eating, melena, indigestion_or_bloating]).
    disease_symptoms(intussusception_of_small_intestine, [colicky_abdominal_pain, vomiting, bloody_stools, palpable_sausage_shaped_mass, fever, rectal_bleeding]).
    disease_symptoms(intussusception_of_large_intestine, [abdominal_pain, vomiting, bloody_stools, palpable_mass_in_abdomen, abdominal_distension, shock]).
    disease_symptoms(appendicitis, [abdominal_pain, nausea, loss_of_appetite, fever, rebound_tenderness, guarding]).
    disease_symptoms(cholelithiasis, [upper_right_abdominal_pain, nausea, vomiting, jaundice, biliary_colic, fatty_food_intolerance]).
    disease_symptoms(acute_pancreatitis, [severe_upper_abdominal_pain, nausea, vomiting, fever, pain_radiating_to_the_back, abdominal_distension, elevated_pancreatic_enzymes]).
    disease_symptoms(hepatitis, [jaundice, fatigue, nausea, vomiting, abdominal_pain, loss_of_appetite, dark_urine, pale_stools]).
    disease_symptoms(crohn_disease, [abdominal_pain, diarrhea, weight_loss, fatigue, malnutrition, rectal_bleeding, fever]).
    disease_symptoms(ulcerative_colitis, [bloody_diarrhea, abdominal_pain, urgency_to_defecate, weight_loss, fatigue, rectal_pain, fever]).
    disease_symptoms(irritable_bowel_syndrome, [abdominal_cramps, bloating, diarrhea, constipation, mucus_in_stool, gas]).
    disease_symptoms(diverticulitis, [lower_left_abdominal_pain, fever, nausea, vomiting, constipation, bloating, rectal_bleeding]).
    disease_symptoms(gastroenteritis, [diarrhea, vomiting, nausea, abdominal_cramps, fever, dehydration, muscle_aches]).
    disease_symptoms(peptic_ulcer, [burning_stomach_pain, bloating, nausea, loss_of_appetite, vomiting, melena]).
    disease_symptoms(celiac_disease, [diarrhea, weight_loss, bloating, fatigue, malnutrition, skin_rash, joint_pain]).
    disease_symptoms(gallbladder_inflammation, [upper_right_abdominal_pain, fever, nausea, vomiting, jaundice, bloating, pain_after_fatty_meals]).
    disease_symptoms(peritonitis, [severe_abdominal_pain, fever, nausea, vomiting, bloating, loss_of_appetite, shock]).
    disease_symptoms(hernia, [abdominal_bulge, pain_when_lifting, burning_sensation, discomfort_in_groin, nausea, vomiting]).
    disease_symptoms(gastroesophageal_reflux_disease, [heartburn, regurgitation, chest_pain, difficulty_swallowing, chronic_cough, sore_throat]).
    disease_symptoms(liver_cirrhosis, [fatigue, jaundice, ascites, nausea, vomiting, easy_bruising, loss_of_appetite]).
    disease_symptoms(meckel_diverticulum, [painless_rectal_bleeding, abdominal_pain, bloating, nausea, vomiting, intestinal_obstruction]).
    disease_symptoms(pyloric_stenosis, [projectile_vomiting, dehydration, weight_loss, constant_hunger, visible_peristalsis, constipation]).
    disease_symptoms(splenic_rupture, [severe_left_upper_abdominal_pain, shoulder_pain, dizziness, hypotension, confusion, tenderness_in_upper_abdomen]).
    disease_symptoms(volvulus, [abdominal_distension, severe_abdominal_pain, nausea, vomiting, constipation, bloody_stools, bowel_obstruction]).
    disease_symptoms(malabsorption_syndrome, [chronic_diarrhea, weight_loss, bloating, fatigue, muscle_wasting, anemia, steatorrhea]).
    disease_symptoms(ischemic_colitis, [sudden_abdominal_pain, bloody_diarrhea, nausea, vomiting, fever, tenderness_in_abdomen]).
    disease_symptoms(hirschsprung_disease, [newborn_constipation, abdominal_distension, failure_to_pass_meconium, vomiting, poor_growth, chronic_diarrhea]).
`;

app.post('/', (req, res) => {
    const session = pl.create();

    session.consult(prologProgram, {
        success: () => {
            const diseases = ['spontaneous_rupture_of_oesophagus', 'oesophagitis', 'gastric_outlet_obstruction', 
                'gastritis', 'gastric_ulcer', 'intussusception_of_small_intestine', 'intussusception_of_large_intestine', 
                'appendicitis', 'cholelithiasis', 'acute_pancreatitis'];
            const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];

            const query = `disease_symptoms(${randomDisease}, Symptoms).`;
            session.query(query);

            session.answers((answer) => {
                if (answer) {
                    if (!res.headersSent) {
                        const symptomsString = session.format_answer(answer).match(/\[.*\]/)[0];
                        const symptoms = symptomsString.slice(1, -1).split(',').map(symptom => symptom.trim());
                        res.json([randomDisease, symptoms]);
                    }
                } else {
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Failed to retrieve symptoms.' });
                    }
                }
            });
        },
        error: (err) => {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Prolog program consultation failed.' + err });
            }
        },
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
