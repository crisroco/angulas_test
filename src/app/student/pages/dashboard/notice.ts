export const notice = [
    {
        imgPath: './assets/img/notice_2.jpg',
        title: 'Conéctate a clases fácil y rápido',
        new: true,
        content: 'Ahora puedes conectarte más rápido a tus clases por Zoom desde la página de Inicio. Para ingresar, dale clic a “Clase en vivo”, sigue las indicaciones y listo. <br>⏰Recuerda: El botón se activa 10 minutos antes de iniciar la clase.',
        limit: (content)=>{
            return content.length>500? content.substring(0,500)+'...': content; 
        },
        filtroInst: ['CPE','PREG'],
        expand: true
    },
    {
        imgPath: 'https://us.123rf.com/450wm/antonioguillem/antonioguillem2004/antonioguillem200400060/144517200-close-up-of-woman-hand-filling-out-form-with-pen-on-a-desk.jpg?ver=6',
        title: 'Proyecto de investigación de UCSUR',
        new: false,
        content: '¡Hola! Estamos realizando un estudio sobre participación política, educación democrática y comunicación digital. ¡Ayúdanos a completar esta encuesta! 📚: <a href="https://forms.gle/tfycy7D8t98nAmzi7"> https://forms.gle/tfycy7D8t98nAmzi7 </a>',
        limit: (content)=>{
            return content.length>500? content.substring(0,500)+'...': content; 
        },
        filtroInst: ['PREG'],
        expand: true
    },
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