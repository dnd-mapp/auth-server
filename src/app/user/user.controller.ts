import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    @Get()
    public async getAll() {
        return await this.userService.getAll();
    }
}
