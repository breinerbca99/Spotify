export class Artist{  // Estamos permitiendo que pueda ser usada en otro fichero con la palabra exports
    constructor(
        public _id: string,
        public name: string,
        public description: string,
        public image: string,
    ){}
}