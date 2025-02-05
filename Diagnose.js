const express = require('express');
const cors = require('cors');
const pl = require('tau-prolog');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const prologProgram = `
    % General Symptoms
    symptom(sudden_severe_chest_pain, unknown).
    symptom(difficulty_swallowing, unknown).
    symptom(vomiting_with_blood, unknown).
    symptom(shock, unknown).

    symptom(heartburn, unknown).
    symptom(dysphagia, unknown).
    symptom(regurgitation, unknown).
    symptom(sore_throat_or_hoarseness, unknown).

    symptom(nausea, unknown).
    symptom(vomiting, unknown).
    symptom(abdominal_bloating, unknown).

    symptom(abdominal_pain_or_discomfort, unknown).
    symptom(loss_of_appetite, unknown).

    symptom(epigastric_pain, unknown).

    symptom(colicky_abdominal_pain, unknown).
    symptom(bloody_stools, unknown).

    symptom(upper_right_abdominal_pain, unknown).

    symptom(severe_upper_abdominal_pain, unknown).
    symptom(fever, unknown).

    % Specific Symptoms
    symptom(pain_worsening_with_swallowing, unknown).
    symptom(subcutaneous_emphysema, unknown). 
    symptom(hematemesis, unknown). 
    symptom(pneumomediastinum, unknown). 

    symptom(pain_while_swallowing, unknown).
    symptom(chest_pain_mistaken_for_heart_attack, unknown).
    symptom(bitter_taste_in_the_mouth, unknown).

    symptom(projectile_vomiting, unknown).
    symptom(epigastric_fullness, unknown).
    symptom(dehydration, unknown).

    symptom(bloating, unknown).
    symptom(heartburn, unknown).

    symptom(pain_after_eating, unknown). 
    symptom(melena, unknown). 
    symptom(indigestion_or_bloating, unknown).

    symptom(palpable_sausage_shaped_mass, unknown). 
    symptom(rectal_bleeding, unknown).

    symptom(palpable_mass_in_abdomen, unknown).
    symptom(abdominal_distension, unknown).

    symptom(rebound_tenderness, unknown). 
    symptom(guarding, unknown). 

    symptom(jaundice, unknown).
    symptom(biliary_colic, unknown). 
    symptom(fatty_food_intolerance, unknown).

    symptom(pain_radiating_to_the_back, unknown).
    symptom(elevated_pancreatic_enzymes, unknown).

    % Disease Rules
    disease(spontaneous_rupture_of_oesophagus) :-
        symptom(sudden_severe_chest_pain, yes),
        symptom(difficulty_swallowing, yes),
        symptom(vomiting_with_blood, yes),
        symptom(shock, yes),
        symptom(pain_worsening_with_swallowing, yes),
        symptom(subcutaneous_emphysema, yes),
        symptom(hematemesis, yes),
        symptom(pneumomediastinum, yes).

    disease(oesophagitis) :-
        symptom(heartburn, yes),
        symptom(dysphagia, yes),
        symptom(regurgitation, yes),
        symptom(sore_throat_or_hoarseness, yes),
        symptom(pain_while_swallowing, yes),
        symptom(chest_pain_mistaken_for_heart_attack, yes),
        symptom(bitter_taste_in_the_mouth, yes).

    disease(gastric_outlet_obstruction) :-
        symptom(nausea, yes),
        symptom(vomiting, yes),
        symptom(abdominal_bloating, yes),
        symptom(projectile_vomiting, yes),
        symptom(epigastric_fullness, yes),
        symptom(loss_of_appetite, yes),
        symptom(dehydration, yes).

    disease(gastritis) :-
        symptom(abdominal_pain_or_discomfort, yes),
        symptom(nausea, yes),
        symptom(loss_of_appetite, yes),
        symptom(bloating, yes),
        symptom(vomiting, yes),
        symptom(heartburn, yes).

    disease(gastric_ulcer) :-
        symptom(epigastric_pain, yes),
        symptom(nausea, yes),
        symptom(vomiting, yes),
        symptom(pain_after_eating, yes),
        symptom(melena, yes),
        symptom(indigestion_or_bloating, yes).

    disease(intussusception_of_small_intestine) :-
        symptom(colicky_abdominal_pain, yes),
        symptom(vomiting, yes),
        symptom(bloody_stools, yes),
        symptom(palpable_sausage_shaped_mass, yes),
        symptom(fever, yes),
        symptom(rectal_bleeding, yes).

    disease(intussusception_of_large_intestine) :-
        symptom(abdominal_pain, yes),
        symptom(vomiting, yes),
        symptom(bloody_stools, yes),
        symptom(palpable_mass_in_abdomen, yes),
        symptom(abdominal_distension, yes),
        symptom(shock, yes).

    disease(appendicitis) :-
        symptom(abdominal_pain, yes),
        symptom(nausea, yes),
        symptom(loss_of_appetite, yes),
        symptom(fever, yes),
        symptom(rebound_tenderness, yes),
        symptom(guarding, yes).

    disease(cholelithiasis) :-
        symptom(upper_right_abdominal_pain, yes),
        symptom(nausea, yes),
        symptom(vomiting, yes),
        symptom(jaundice, yes),
        symptom(biliary_colic, yes),
        symptom(fatty_food_intolerance, yes).

    disease(acute_pancreatitis) :-
        symptom(severe_upper_abdominal_pain, yes),
        symptom(nausea, yes),
        symptom(vomiting, yes),
        symptom(fever, yes),
        symptom(pain_radiating_to_the_back, yes),
        symptom(abdominal_distension, yes),
        symptom(elevated_pancreatic_enzymes, yes).


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