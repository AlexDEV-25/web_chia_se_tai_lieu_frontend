export class Category {
    id: number;
    name: string;
    description: string;
    hide: boolean;

    constructor(id: number, name: string, description: string, hide: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.hide = hide;
    }

}
