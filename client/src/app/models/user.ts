export class User{  // Estamos permitiendo que pueda ser usada en otro fichero con la palabra exports
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ){}
}