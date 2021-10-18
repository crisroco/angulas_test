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
        imgPath: './assets/img/notice_10.png',
        title: 'Participa en el Impact Startup Competition',
        new: true,
        content: `El área de emprendimiento y el comité local están organizando el Impact Startup Competition Ucsur, programa para fomentar emprendimientos que apoyen a los objetivos de desarrollo sostenibles. Se darán horas extracurriculares. <a href="https://sites.google.com/view/iscucsur/inicio">Más info aquí.</a>`,
        limit: (content)=>{
            return content.length>333? content.substring(0,333)+'...': content; 
        },
        filtroInst: ['PREGR', 'CPE'],
        useCSV: false,
        expand: true,
        full: true,
    },
    {
        imgPath: 'https://us.123rf.com/450wm/antonioguillem/antonioguillem2004/antonioguillem200400060/144517200-close-up-of-woman-hand-filling-out-form-with-pen-on-a-desk.jpg?ver=6',
        title: 'Proyecto de investigación de UCSUR',
        new: false,
        content: '¡Hola! Estamos realizando un estudio sobre participación política, educación democrática y comunicación digital. ¡Ayúdanos a completar esta encuesta! 📚: <a href="https://forms.gle/tfycy7D8t98nAmzi7"> https://forms.gle/tfycy7D8t98nAmzi7 </a>',
        limit: (content)=>{
            return content.length>300? content.substring(0,300)+'...': content; 
        },
        filtroInst: ['PREGR'],
        useCSV: false,
        expand: false,
        full: false,
    }
    // {
    //     imgPath: './assets/img/pre-matricula.svg',
    //     title: 'Mira el Calendario de Pre-Matrícula',
    //     content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it.',
    //     limit: (content):string=>{
    //         return content.length>150? content.substring(0,150)+'...': content; 
    //     },
    //     expand: false
    // },
    // {
    //     imgPath: './assets/img/pre-matricula.svg',
    //     title: 'Unidad de Responsabilidad Social Universitaria',
    //     content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text.',
    //     limit: (content)=>{
    //         return content.length>150? content.substring(0,150)+'...': content; 
    //     },
    //     expand: false
    // }
];