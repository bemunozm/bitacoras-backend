
export const diseases = [
    {
      "name": "Resfriado común",
      "description": "Infección viral que afecta la nariz y la garganta.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Descanso, hidratación abundante, tomar té caliente con miel y limón. Medicamentos como paracetamol o ibuprofeno pueden aliviar síntomas."
    },
    {
      "name": "Gripe",
      "description": "Enfermedad respiratoria causada por virus de la familia Orthomyxoviridae.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo, tomar líquidos calientes, analgésicos como paracetamol. Vacuna anual puede prevenir ciertas cepas."
    },
    {
      "name": "Hipertensión",
      "description": "Aumento constante de la presión arterial en las arterias.",
      "type": "Crónica",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Dieta baja en sal, ejercicio regular, reducir el estrés. Medicamentos como inhibidores de la ECA o diuréticos son necesarios en casos graves."
    },
    {
      "name": "Diabetes tipo 2",
      "description": "Trastorno metabólico caracterizado por niveles altos de glucosa en sangre.",
      "type": "Metabólica",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Control de peso, dieta equilibrada, ejercicio regular. Medicación oral o insulina según la severidad. Monitorear niveles de azúcar en sangre."
    },
    {
      "name": "Asma",
      "description": "Enfermedad crónica de las vías respiratorias que causa dificultad para respirar.",
      "type": "Respiratoria",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Evitar desencadenantes como alergenos o humo. Uso de inhaladores (de rescate o control). Consulta médica regular."
    },
    {
      "name": "Dengue",
      "description": "Enfermedad transmitida por mosquitos del género Aedes, caracterizada por fiebre alta y dolores musculares.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Reposo, hidratación abundante, evitar aspirina. En casos graves, consulta médica inmediata. Usar repelente para prevenir picaduras."
    },
    {
      "name": "Varicela",
      "description": "Enfermedad viral altamente contagiosa que causa sarpullido y comezón en la piel.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Baños de avena para calmar la comezón, evitar rascarse. Vacunación disponible para prevenir la enfermedad."
    },
    {
      "name": "Conjuntivitis",
      "description": "Inflamación de la conjuntiva, la membrana que cubre la parte blanca del ojo.",
      "type": "Infecciosa",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Lavado frecuente de manos, no compartir toallas ni almohadas. Gotas oftálmicas pueden ser recomendadas en algunos casos."
    },
    {
      "name": "Caries dental",
      "description": "Deterioro de los dientes debido a bacterias que producen ácidos a partir de los azúcares.",
      "type": "Bacteriana",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Higiene bucal adecuada (cepillado y uso de hilo dental), reducir consumo de azúcares. Tratamiento dental profesional si hay deterioro avanzado."
    },
    {
      "name": "Eczema",
      "description": "Afección inflamatoria de la piel que provoca picazón, enrojecimiento y descamación.",
      "type": "Dermatológica",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Uso de cremas hidratantes, evitar irritantes. En casos graves, corticosteroides tópicos o antihistamínicos pueden ser necesarios."
    },
    {
      "name": "Amigdalitis",
      "description": "Inflamación de las amígdalas, generalmente causada por una infección viral o bacteriana.",
      "type": "Infecciosa",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Gárgaras con agua salada, reposo, hidratación. Antibióticos solo en casos bacterianos confirmados."
    },
    {
      "name": "Bronquitis",
      "description": "Inflamación de los bronquios que causa tos persistente y producción de flema.",
      "type": "Respiratoria",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Descanso, hidratación, evitar irritantes como el humo. Inhaladores o medicamentos pueden ser necesarios en casos crónicos."
    },
    {
      "name": "Rinitis alérgica",
      "description": "Inflamación de la mucosa nasal causada por alergias.",
      "type": "Alergia",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Evitar alergenos, usar antihistamínicos, lavados nasales con solución salina."
    },
    {
      "name": "Otitis media",
      "description": "Infección del oído medio que causa dolor e inflamación.",
      "type": "Infecciosa",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Aplicar calor en el oído, analgésicos como paracetamol. Antibióticos en casos severos."
    },
    {
      "name": "Herpes labial",
      "description": "Infección viral que causa pequeñas ampollas en los labios.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Mantener los labios secos y limpios, aplicar cremas antivirales. Evitar contacto directo para prevenir contagio."
    },
    {
      "name": "Migraña",
      "description": "Dolor de cabeza intenso acompañado de náuseas y sensibilidad a la luz.",
      "type": "Neurológica",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Descanso en un lugar oscuro y tranquilo, analgésicos como ibuprofeno. Evitar desencadenantes como el estrés o ciertos alimentos."
    },
    {
      "name": "Anemia",
      "description": "Deficiencia de glóbulos rojos o hemoglobina en la sangre.",
      "type": "Hematológica",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Consumir alimentos ricos en hierro (espinacas, carne roja), suplementos de hierro. Consulta médica para determinar la causa subyacente."
    },
    {
      "name": "Artritis",
      "description": "Inflamación de las articulaciones que causa dolor y rigidez.",
      "type": "Autoinmune",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Ejercicio suave, calor o frío en las articulaciones. Medicamentos antiinflamatorios o inmunosupresores según la gravedad."
    },
    {
      "name": "Gastritis",
      "description": "Inflamación del revestimiento del estómago que causa dolor abdominal.",
      "type": "Digestiva",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Evitar alimentos irritantes, tomar antiácidos, consumir alimentos blandos. Reducir el estrés y evitar el alcohol."
    },
    {
      "name": "Insomnio",
      "description": "Dificultad para conciliar o mantener el sueño.",
      "type": "Psicológica",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Establecer una rutina de sueño, evitar pantallas antes de dormir. Técnicas de relajación como meditación o yoga."
    },
    {
      "name": "Obesidad",
      "description": "Acumulación excesiva de grasa corporal que afecta la salud.",
      "type": "Metabólica",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Dieta equilibrada, ejercicio regular, reducción de calorías. Consulta médica para manejo integral."
    },
    {
      "name": "Faringitis",
      "description": "Inflamación de la faringe que causa dolor de garganta.",
      "type": "Infecciosa",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Gárgaras con agua salada, analgésicos como paracetamol. Antibióticos solo en casos bacterianos."
    },
    {
      "name": "Laringitis",
      "description": "Inflamación de la laringe que causa ronquera y pérdida de voz.",
      "type": "Infecciosa",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo vocal, hidratación, evitar irritantes como el humo. Analgésicos para aliviar el dolor."
    },
    {
      "name": "Sarampión",
      "description": "Enfermedad viral altamente contagiosa que causa fiebre y sarpullido.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo, hidratación, analgésicos. Vacunación es la mejor prevención."
    },
    {
      "name": "Paperas",
      "description": "Infección viral que causa inflamación de las glándulas salivales.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo, analgésicos, aplicar compresas frías en las mejillas. Vacunación previene la enfermedad."
    },
    {
      "name": "Tuberculosis",
      "description": "Infección bacteriana que afecta principalmente los pulmones.",
      "type": "Bacteriana",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Tratamiento prolongado con antibióticos específicos. Aislamiento en casos activos para prevenir contagio."
    },
    {
      "name": "Hepatitis A",
      "description": "Infección viral del hígado que causa ictericia y fatiga.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo, hidratación, evitar alcohol. Vacunación previene la enfermedad."
    },
    {
      "name": "Hepatitis B",
      "description": "Infección viral del hígado que puede volverse crónica.",
      "type": "Viral",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Vacunación previene la enfermedad. Tratamiento antiviral en casos crónicos."
    },
    {
      "name": "Hepatitis C",
      "description": "Infección viral del hígado que puede causar daño hepático crónico.",
      "type": "Viral",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Tratamiento antiviral específico. No hay vacuna disponible."
    },
    {
      "name": "Cólera",
      "description": "Infección intestinal causada por bacterias que produce diarrea severa.",
      "type": "Bacteriana",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Hidratación oral o intravenosa. Antibióticos en casos graves."
    },
    {
      "name": "Lepra",
      "description": "Infección crónica causada por Mycobacterium leprae que afecta la piel y nervios.",
      "type": "Bacteriana",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Tratamiento prolongado con antibióticos específicos. Aislamiento en casos avanzados."
    },
    {
      "name": "Malaria",
      "description": "Enfermedad transmitida por mosquitos que causa fiebre y escalofríos.",
      "type": "Parasitaria",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Medicamentos antipalúdicos específicos. Usar repelente y mosquiteros para prevenir picaduras."
    },
    {
      "name": "Esquistosomiasis",
      "description": "Infección parasitaria que afecta el hígado y el intestino.",
      "type": "Parasitaria",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Tratamiento con praziquantel. Evitar contacto con aguas contaminadas."
    },
    {
      "name": "Chagas",
      "description": "Enfermedad parasitaria transmitida por insectos triatomíneos.",
      "type": "Parasitaria",
      "treatment_required": true,
      "contagious": false,
      "notes": "Remedios: Tratamiento con benznidazol o nifurtimox. Mejorar condiciones de vivienda para prevenir."
    },
    {
      "name": "Zika",
      "description": "Enfermedad viral transmitida por mosquitos que puede causar malformaciones congénitas.",
      "type": "Viral",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Reposo, hidratación. Usar repelente y mosquiteros para prevenir picaduras."
    },
    {
      "name": "Ébola",
      "description": "Enfermedad viral grave que causa fiebre hemorrágica.",
      "type": "Viral",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Hidratación intravenosa, tratamiento sintomático. Aislamiento estricto para prevenir contagio."
    },
    {
      "name": "VIH/SIDA",
      "description": "Infección viral que ataca el sistema inmunológico.",
      "type": "Viral",
      "treatment_required": true,
      "contagious": true,
      "notes": "Remedios: Terapia antirretroviral para controlar la carga viral. Prácticas seguras para prevenir transmisión."
    },
    {
      "name": "Psoriasis",
      "description": "Enfermedad autoinmune que causa parches escamosos en la piel.",
      "type": "Autoinmune",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Uso de cremas hidratantes, exposición moderada al sol. Medicamentos específicos en casos graves."
    },
    {
      "name": "Rosácea",
      "description": "Enfermedad crónica de la piel que causa enrojecimiento facial.",
      "type": "Dermatológica",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Evitar desencadenantes como el calor o el alcohol. Cremas tópicas y láser pueden ayudar."
    },
    {
      "name": "Acné",
      "description": "Enfermedad de la piel que causa granos y espinillas.",
      "type": "Dermatológica",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Limpieza facial suave, uso de productos no comedogénicos. Tratamiento con retinoides o antibióticos en casos severos."
    },
    {
      "name": "Tiña",
      "description": "Infección micótica que causa sarpullido en forma de anillo.",
      "type": "Micótica",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Antifúngicos tópicos o sistémicos. Mantener la piel seca y limpia."
    },
    {
      "name": "Pie de atleta",
      "description": "Infección micótica que afecta los pies.",
      "type": "Micótica",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Antifúngicos tópicos, mantener los pies secos. Cambiar calcetines regularmente."
    },
    {
      "name": "Candidiasis",
      "description": "Infección micótica causada por Candida albicans.",
      "type": "Micótica",
      "treatment_required": false,
      "contagious": true,
      "notes": "Remedios: Antifúngicos tópicos o sistémicos. Mantener áreas afectadas secas y limpias."
    },
    {
      "name": "Urticaria",
      "description": "Erupción cutánea con picazón causada por una reacción alérgica.",
      "type": "Alergia",
      "treatment_required": false,
      "contagious": false,
      "notes": "Remedios: Antihistamínicos orales, evitar desencadenantes. Compresas frías para aliviar la picazón."
    },
    {
        "name": "Pediculosis",
        "description": "Infestación por piojos que causa picazón intensa en el cuero cabelludo.",
        "type": "Parasitaria",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Champús antiparasitarios como permetrina o malatión. Lavado de ropa y objetos personales."
    },
    {
        "name": "Escabiosis",
        "description": "Infestación por ácaros que causa picazón intensa, especialmente por la noche.",
        "type": "Parasitaria",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Crema de permetrina o ivermectina oral. Lavado de ropa y sábanas a alta temperatura."
    },
    {
        "name": "Neumonía",
        "description": "Infección pulmonar que causa fiebre, tos y dificultad para respirar.",
        "type": "Infecciosa",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Antibióticos en casos bacterianos, reposo e hidratación. Consulta médica inmediata en casos graves."
    },
    {
        "name": "Enfermedad de Lyme",
        "description": "Infección bacteriana transmitida por garrapatas que puede causar erupciones cutáneas y síntomas sistémicos.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos como doxiciclina. Evitar áreas con garrapatas y usar repelente."
    },
    {
        "name": "Tétanos",
        "description": "Infección bacteriana que afecta el sistema nervioso, causando rigidez muscular.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Vacunación previene la enfermedad. Tratamiento con toxina antitetánica en casos activos."
    },
    {
        "name": "Leishmaniasis",
        "description": "Infección parasitaria transmitida por mosquitos que causa úlceras cutáneas o afectación visceral.",
        "type": "Parasitaria",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Tratamiento con antimoniales pentavalentes. Protección contra picaduras de insectos."
    },
    {
        "name": "Fiebre tifoidea",
        "description": "Infección bacteriana transmitida por alimentos o agua contaminada que causa fiebre alta y dolor abdominal.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Antibióticos específicos. Vacunación previene la enfermedad."
    },
    {
        "name": "Hepatitis E",
        "description": "Infección viral del hígado transmitida por agua contaminada.",
        "type": "Viral",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Reposo, hidratación, evitar alcohol. Mejorar acceso a agua potable para prevenir."
    },
    {
        "name": "Tuberculosis ganglionar",
        "description": "Forma de tuberculosis que afecta los ganglios linfáticos.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Tratamiento prolongado con antibióticos específicos. Aislamiento en casos activos."
    },
    {
        "name": "Onicomicosis",
        "description": "Infección micótica que afecta las uñas de manos o pies.",
        "type": "Micótica",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Antifúngicos tópicos o sistémicos. Mantener las uñas cortas y secas."
    },
    {
        "name": "Desnutrición",
        "description": "Déficit de nutrientes esenciales debido a una dieta inadecuada.",
        "type": "Nutricional",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Suplementos nutricionales, acceso a alimentos ricos en proteínas, vitaminas y minerales. Atención médica integral."
    },
    {
        "name": "Hipertermia",
        "description": "Aumento excesivo de la temperatura corporal debido a la exposición al calor.",
        "type": "Ambiental",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Hidratación, enfriamiento corporal mediante baños fríos o compresas. Buscar sombra o refugio fresco."
    },
    {
        "name": "Hipotermia",
        "description": "Disminución peligrosa de la temperatura corporal debido a la exposición al frío.",
        "type": "Ambiental",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Abrigos, mantas térmicas, bebidas calientes. Evitar exposición prolongada al frío."
    },
    {
        "name": "Erisipela",
        "description": "Infección bacteriana de la piel que causa enrojecimiento, calor y dolor.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos orales o intravenosos. Mantener la piel limpia y seca."
    },
    {
        "name": "Celulitis",
        "description": "Infección bacteriana de la piel que causa inflamación y enrojecimiento.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos orales o intravenosos. Mantener la piel limpia y seca."
    },
    {
        "name": "Herpes zóster",
        "description": "Reactivación del virus de la varicela que causa dolor y erupciones cutáneas.",
        "type": "Viral",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Antivirales como aciclovir, analgésicos. Vacunación reduce el riesgo de reactivación."
    },
    {
        "name": "Toxoplasmosis",
        "description": "Infección parasitaria que puede ser asintomática o causar síntomas similares a la gripe.",
        "type": "Parasitaria",
        "treatment_required": false,
        "contagious": false,
        "notes": "Remedios: Tratamiento con pirimetamina y sulfadiazina en casos graves. Evitar contacto con heces de gato."
    },
    {
        "name": "Brucelosis",
        "description": "Infección bacteriana transmitida por consumo de productos lácteos no pasteurizados.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos como doxiciclina y rifampicina. Evitar consumir alimentos no pasteurizados."
    },
    {
        "name": "Rabia",
        "description": "Enfermedad viral mortal transmitida por mordeduras de animales infectados.",
        "type": "Viral",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Vacunación post-exposición inmediata. Evitar contacto con animales salvajes o callejeros."
    },
    {
        "name": "Leptospirosis",
        "description": "Infección bacteriana transmitida por contacto con agua contaminada con orina de roedores.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos como doxiciclina. Evitar contacto con aguas estancadas o contaminadas."
    },
    {
        "name": "Infección por MRSA",
        "description": "Infección bacteriana resistente a múltiples antibióticos que puede afectar la piel o tejidos profundos.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Antibióticos específicos según cultivos. Mantener heridas limpias y cubiertas."
    },
    {
        "name": "Quemaduras solares",
        "description": "Daño a la piel causado por exposición prolongada al sol sin protección.",
        "type": "Ambiental",
        "treatment_required": false,
        "contagious": false,
        "notes": "Remedios: Hidratación, aplicación de aloe vera, evitar más exposición solar. Usar protector solar."
    },
    {
        "name": "Dermatitis de contacto",
        "description": "Inflamación de la piel causada por contacto directo con sustancias irritantes o alergenos.",
        "type": "Dermatológica",
        "treatment_required": false,
        "contagious": false,
        "notes": "Remedios: Lavar la piel con agua y jabón, uso de cremas corticoides. Evitar el contacto con desencadenantes."
    },
    {
        "name": "Sarna noruega",
        "description": "Forma severa de escabiosis que causa engrosamiento de la piel y costras.",
        "type": "Parasitaria",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Tratamiento con permetrina o ivermectina. Lavado de ropa y objetos personales."
    },
    {
        "name": "Infección urinaria",
        "description": "Infección bacteriana que afecta el tracto urinario, causando ardor al orinar.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Antibióticos como trimetoprim-sulfametoxazol. Beber abundante agua para eliminar bacterias."
    },
    {
        "name": "Absceso cutáneo",
        "description": "Acumulación de pus bajo la piel causada por una infección bacteriana.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Drenaje quirúrgico, antibióticos en casos graves. Mantener la zona limpia."
    },
    {
        "name": "Meningitis bacteriana",
        "description": "Infección grave de las membranas que rodean el cerebro y la médula espinal.",
        "type": "Bacteriana",
        "treatment_required": true,
        "contagious": true,
        "notes": "Remedios: Tratamiento urgente con antibióticos intravenosos. Vacunación previene ciertos tipos."
    },
    {
        "name": "Enfermedad de Chagas crónica",
        "description": "Fase avanzada de la enfermedad de Chagas que afecta el corazón y el sistema digestivo.",
        "type": "Parasitaria",
        "treatment_required": true,
        "contagious": false,
        "notes": "Remedios: Tratamiento con benznidazol o nifurtimox. Manejo médico especializado para complicaciones."
    },
    {
        "name": "Tungiasis",
        "description": "Infestación por pulgas que penetran en la piel, causando inflamación y dolor.",
        "type": "Parasitaria",
        "treatment_required": false,
        "contagious": true,
        "notes": "Remedios: Extracción manual de las pulgas, uso de antisépticos. Mejorar condiciones de higiene."
    }
  ]