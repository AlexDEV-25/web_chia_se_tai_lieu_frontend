export default class CategoryRequest {
    name: string;
    description: string;
    hide: boolean;

    constructor(
        name: string,
        description: string,
        hide: boolean = false
    ) {
        this.name = name;
        this.description = description;
        this.hide = hide;
    }
}
