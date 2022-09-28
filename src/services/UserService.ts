

export default class UserService {
    private static instance?: UserService;

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    static destroyInstance(): void {
        delete this.instance;
    }
};