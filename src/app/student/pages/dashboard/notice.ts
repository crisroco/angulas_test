export const notice = [
    // {
    //     imgPath: './assets/img/notice_9.png',
    //     title: '¡CUIDAMOS DE TI!',
    //     new: true,
    //     content: `¡Hola!, estamos tomando medidas para prevenir y controlar el COVID-19; que forman parte de la reanudación de componentes presenciales del servicio educativo superior universitario exigido por la SUNEDU, necesitamos que puedan completar en el <a href="https://bit.ly/3o1KtSX"> siguiente formulario </a>`,
    //     limit: (content)=>{
    //         return content.length>333? content.substring(0,333)+'...': content; 
    //     },
    //     filtroInst: ['ALL'],
    //     useCSV: false,
    //     expand: true,
    //     full: true,
    // },
    // {
    //     imgPath: './assets/img/notice_7.jpg',
    //     title: 'Encuesta de Evaluación del Desempeño docente en Clase 2021-2',
    //     new: false,
    //     content: `Estimado estudiante, te invitamos a ser parte de la evaluación de tus docentes en tu <b>"AULA VIRTUAL</b>"
    //     completando la Encuesta de Evaluación del Desempeño Docente en clase 2021-2.`,
    //     limit: (content)=>{
    //         return content.length>333? content.substring(0,333)+'...': content; 
    //     },
    //     filtroInst: ['PSTGR'],
    //     useCSV: false,
    //     expand: false,
    //     full: false,
    // },
    // {
    //     imgPath: './assets/img/notice_8.jpg',
    //     title: 'Encuesta de Evaluación del Desempeño docente en Clase 2021-2',
    //     new: false,
    //     content: `Estimado estudiante, te invitamos a ser parte de la evaluación de tus docentes completando la Encuesta de Evaluación del Desempeño Docente en clase 2021-2 haciendo <a href="https://sedd.cientifica.edu.pe/login/ingresar"> CLICK AQUÍ </a>`,
    //     limit: (content)=>{
    //         return content.length>333? content.substring(0,333)+'...': content; 
    //     },
    //     filtroInst: ['PREGR', 'CPE'],
    //     useCSV: false,
    //     expand: false,
    //     full: false,
    // },
    // {
    //     imgPath: './assets/img/notice_6.jpg',
    //     title: 'Semana de Empleabilidad y Feria laboral virtual',
    //     new: false,
    //     content: `Te invitamos a participar de la Semana de Empleabilidad de la Universidad Científica del Sur y capacítate con empresas líderes en el país. Además, podrás realizar evaluaciones para conocer tu perfil de emplebilidad y postular a ofertas laborales en nuestra <a href="https://ferialaboralcientifica.taalentfy.com/fair/home"> Feria Virtual </a> 
    //     Conoce la programación de charlas <a href="https://bit.ly/Charlassemanadeempleabilidad2021"> aquí </a>`,
    //     limit: (content)=>{
    //         return content.length>333? content.substring(0,333)+'...': content; 
    //     },
    //     filtroInst: ['PREGR', 'CPE'],
    //     useCSV: false,
    //     expand: true,
    //     full: true,
    // },
    // {
    //     imgPath: './assets/img/notice_4.png',
    //     title: 'INTENCIÓN DE MATRÍCULA 2021-2 📚',
    //     new: false,
    //     content: ' ¡Hola! Te invitamos a contestar esta breve encuesta que servirá para conocer tu experiencia en el nuevo proceso de INTENCIÓN DE MATRÍCULA 2021-2. Tu aporte es muy importante para nosotros y así seguir mejorando tu experiencia en los próximos procesos. Completa la encuesta <a href="https://bit.ly/38XSjUN">aquí.</a>',
    //     limit: (content)=>{
    //         return content.length>300? content.substring(0,300)+'...': content; 
    //     },
    //     filtroInst: [],
    //     useCSV: true,
    //     expand: true,
    //     full: true
    // },
    // {
    //     imgPath: './assets/img/notice_5.png',
    //     title: 'CONOCE EL NUEVO ACCESO AL AULA VIRTUAL',
    //     new: false,
    //     content: `Ahora podrás ingresar al Aula virtual Científica de una manera más fácil: <br>
    //     1. Dale clic a <a href="https://cientificavirtual.cientifica.edu.pe"> https://cientificavirtual.cientifica.edu.pe </a> <br>
    //     2. Ingresa los datos de tu correo institucional (correo y contraseña) y listo. <br>
    //     Recuerda: Podrás seguir conectándote al Aula virtual, desde Intranet Científica. La marcación de asistencia se realiza cuando te conectas desde el Aula Virtual o Intranet.
    //     `,
    //     limit: (content)=>{
    //         return content.length>300? content.substring(0,300)+'...': content; 
    //     },
    //     filtroInst: ['PREGR', 'CPE'],
    //     useCSV: false,
    //     expand: false,
    //     full: false,
    // },
    {
        imgPath: 'https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/noticias/bbva-banner.jpg',
        title: 'El BBVA se une a la familia científica como un nuevo medio de Pago',
        new: true,
        content: `Hola te invitamos a revisar esta importante información en el siguiente <a target="_blank" href="https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/documentos/comunicado-bbva.pdf">link</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: ['ALL'],
        filtroCarr: ['ALL'],
        useCSV: false,
        useCSV2: false,
        expand: true,
        full: true,
    },
    {
        imgPath: 'https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/noticias/TalentShow.png',
        title: 'Evento Semana de la medicina Científica',
        new: true,
        content: `¡Hola, ven a celebrar la semana de la medicina con tus compañeros, con tus docentes y con nosotros!
<p class="m-0">Muéstranos tu talento artístico en un TikTok en una noche de talentos moderna. Vamos a divertirnos jugando a ser médicos con los simuladores y pondremos a prueba nuestros conocimientos en una trivia académica. ¡Te esperamos!</p>
<p class="m-0">Bases del concurso en el siguiente enlace: <a target="_blank" href="https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/documentos/pregrado/medicina/evento-semana-medicina-bases.pf">Link de las bases</a></p>
<p class="m-0">Inscribe a tu equipo en el siguiente enlace: <a target="_blank" href="https://forms.office.com/Pages/ResponsePage.aspx?id=EM3epWWRNkamTHlYAEIV-qsRmH0SHCNOl5DlSkBK9RNUNVZQUjRGRFlNNlpUTDc3VTJTRVZNWlhQUi4u&wdLOR=cDAC192C5-C5EB-4818-8EF8-65CDB0A5FCEC">Link de inscripción</a></p>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: ['PREGR'],
        filtroCarr: ['PFMEH'],
        useCSV: false,
        useCSV2: false,
        expand: true,
        full: true,
    },
    {
        imgPath: 'https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/noticias/Imagen%20Conversatorio%20Medicina%20VGU%2021%202.jpg',
        title: 'Conversatorio: Historias de éxito, ¿por qué amo la Medicina Humana? ',
        new: true,
        content: `Participa y conoce la historia de Gabriela, una egresada de Medicina Humana en UCSUR, quien al igual que tú, empezó con la misma pasión y ahora construye un mundo mejor. ¡Te esperamos!. Inscríbete aquí: <a target="_blank" href="https://forms.gle/ihqWqn38PzA3YAoB9">https://forms.gle/ihqWqn38PzA3YAoB9</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: ['PREGR'],
        filtroCarr: ['PFMEH'],
        useCSV: false,
        useCSV2: false,
        expand: true,
        full: true,
    },
    // {
    //     imgPath: './assets/img/notice_10.png',
    //     title: 'Participa en el Impact Startup Competition',
    //     new: false,
    //     content: `El área de emprendimiento y el comité local están organizando el Impact Startup Competition Ucsur, programa para fomentar emprendimientos que apoyen a los objetivos de desarrollo sostenibles. Se darán horas extracurriculares. <a href="https://sites.google.com/view/iscucsur/inicio">Más info aquí.</a>`,
    //     limit: (content)=>{
    //         return content.length>333? content.substring(0,333)+'...': content; 
    //     },
    //     filtroInst: ['PREGR', 'CPE'],
    //     filtroCarr: ['ALL'],
    //     useCSV: false,
    //     useCSV2: false,
    //     expand: true,
    //     full: true,
    // },
    {
        imgPath: './assets/img/notice_11_1.jpg',
        title: 'Experiencia de Bienvenida a la Universidad',
        new: false,
        content: `¡Hola! Te invitamos a contestar esta breve encuesta que servirá para conocer tu experiencia con la Universidad durante el inicio de tu vida universitaria. Tu aporte es muy importante para nosotros y así seguir mejorando juntos. Completa la encuesta <a target="_blank" href="https://cutt.ly/ZRbdtV2">AQUÍ</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: [],
        filtroCarr: [],
        useCSV: true,
        useCSV2: false,
        expand: true,
        full: true,
    },
    {
        imgPath: './assets/img/notice_11_2.jpg',
        title: 'Experiencia de Bienvenida a la Universidad',
        new: false,
        content: `¡Hola! Te invitamos a contestar esta breve encuesta que servirá para conocer tu experiencia con la Universidad durante el inicio de tu vida universitaria. Tu aporte es muy importante para nosotros y así seguir mejorando juntos. Completa la encuesta <a target="_blank" href="https://cutt.ly/3RbfmBQ">AQUÍ</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: [],
        filtroCarr: [],
        useCSV: false,
        useCSV2: true,
        expand: true,
        full: true,
    },
    {
        imgPath: './assets/img/notice_12.jpg',
        title: 'COMUNICADO CLASES PRESENCIALES 2022-1',
        new: false,
        content: `Invocamos a todos nuestros estudiantes a leer este importante comunicado de la Universidad. <a target="_blank" href="https://docs.cientifica.edu.pe/miportal_sise/miportal_cientifica/noticias/Comunicado%20CLASES%20PRESENCIALES%202022%20Vfinal.pdf">Ver comunicado</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: ['ALL'],
        filtroCarr: ['ALL'],
        useCSV: false,
        useCSV2: false,
        expand: true,
        full: true,
    }
];