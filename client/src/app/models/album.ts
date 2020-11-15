import { Artist } from './artist';
export class Album{  // Estamos permitiendo que pueda ser usada en otro fichero con la palabra exports
    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public year: string,
        public image: string,
        public artist: string  // Campo que relacione
    ){}
}