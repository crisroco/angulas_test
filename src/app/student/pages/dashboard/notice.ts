export const notice = [
    {
        imgPath: './assets/img/carne.png',
        title: 'Ya puedes solicitar tu carnet universitario',
        content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been theLorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been theLorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been theLorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been theLorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the the 1500s dummy text ever since the 1500s dummyLorem Ipsum has been the',
        limit: (content)=>{
            return content.length>150? content.substring(0,150)+'...': content; 
        },
        expand: false
    },
    {
        imgPath: './assets/img/calendar.png',
        title: 'Mira el Calendario de Pre-Matrícula',
        content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it.',
        limit: (content):string=>{
            return content.length>150? content.substring(0,150)+'...': content; 
        },
        expand: false
    },
    {
        imgPath: './assets/img/univer.png',
        title: 'Unidad de Responsabilidad Social Universitaria',
        content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s. when an unknown printer took a galley of type and scrambled it to make a type specimen. Lorem Ipsum has been the industrys standard dummy text.',
        limit: (content)=>{
            return content.length>150? content.substring(0,150)+'...': content; 
        },
        expand: false
    }
];

export const course = [
    {
        title:'Intro a los Negocios Sostenibles',
        time: 'EN 2 HORAS',
        active: true,
        duration: '12:30 - 13:30 hrs'
    },
    {
        title:'Gestión Estratégica',
        time: 'EN 2 HORAS',
        active: false,
        duration: '14:00 - 16:00 hrs'
    },
    {
        title:'Realidad Nacional',
        time: 'EN 2 HORAS',
        active: false,
        duration: '18:00 - 19:00 hrs'
    }
];