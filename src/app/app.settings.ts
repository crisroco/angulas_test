export class AppSettings {
	public static COMPANY = 'ucs';
    public static STRINGS = {
        'role': 'Rol',
        'email': 'Correo',
        'dni': 'DNI',
        'lastname': 'Apellido',
        'firstname': 'Nombre',
        'password': 'Contraseña',
        'messenger': 'Agente',
        'phone': 'Teléfono',
        'birth_date': 'Fecha de nacimiento',
        'department': 'Departamento',
        'province': 'Provincia',
        'district': 'Distrito',
        'who_finances': '¿Quién financia tus estudios?',
        'working': '¿Actualmente trabajas?',
        'company_email': 'Correo laboral',
        'company_name': 'Nombre Empresa',
        'company_position': 'Cargo',
        'privacy_policy': 'Políticas de privacidad'
    }
    public static NAMES_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    public static NAMES_MONTH = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    public static BASE = "https://back-miportal.cientifica.edu.pe";

    // public static BASE = "https://back-miportal.sise.edu.pe";
    // public static BASE = "http://localhost:8000";
    // public static BASE = "https://backdev-miportal.cientifica.edu.pe";
    // public static BASE = "https://back2-miportal-dev.cientifica.edu.pe";
    // public static BASE = "https://back-miportal-dev.cientifica.edu.pe";
    // public static BASE = "https://backdev03-miportal.cientifica.edu.pe";
    public static CLIENT = '/api/client/parameters';
    public static STUDENT = '/student';
    public static INTENTION = '/intention';
    public static ASSISTANCE = '/assistance';
    public static PERSONAL_DATA = '/data';
    public static PEOPLE_LOGIN = 'https://academico.cientifica.edu.pe/psp/CS90PRD/?cmd=login&languageCd=ESP';
    // public static PEOPLE_LOGIN = 'http://testmatricula.cientifica.edu.pe/psp/CS90PD/?cmd=login&languageCd=ESP&';
    public static WSURL = 'https://backdev-colas.cientifica.edu.pe:5000/';
    // public static WSURL = 'https://backdev03-colas.cientifica.edu.pe:5001/';
    // BackOffice
    public static ACCESS_VAC = { "action": "login", "name": "admin", "pass": "aic37896" };
    public static ACCESS_PS = `http://educanet.back.educad.pe/resources_portal/access_ps`;
    public static BASE_SISE_CODEIGNITER = 'http://proyectos.educad.pe';
    public static LOGIN_TOKEN = 'http://educanet.back.educad.pe/ucsur_token/access';
    public static WS_DRUPAL_GENERARTOKEN = 'http://educanet.back.educad.pe/session/token';
    public static WS_DRUPAL_LOGINVACACIONES = 'http://educanet.back.educad.pe/vacaciones/user';
}