const express = require('express');
const cors = require('cors');
const pl = require('tau-prolog');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const prologProgram = `
    % Symptom Association
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
