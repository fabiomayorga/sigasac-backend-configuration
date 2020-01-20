import { Injectable, Logger } from '@nestjs/common';

import {
    DatabaseProvider,
    Permission,
    MenuPermissionProfile
} from 'sigasac-db';

import { MenuPermissionProfileDto } from './dto';

@Injectable()
export class PermissionsService {
    async getAll() {
        try {
            const connection = await DatabaseProvider.getConnection();

            return await connection.getRepository(Permission).find({
                order: {
                    id: 'ASC'
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async getMenusAndPermissionByProfile(profileId: number) {
        try {
            const connection = await DatabaseProvider.getConnection();

            return await connection
                .getRepository(MenuPermissionProfile)
                .createQueryBuilder('mpp')
                .leftJoinAndSelect('mpp.menu', 'menu')
                .leftJoinAndSelect('mpp.permission', 'permission')
                .where('mpp.profileId = :profileId', { profileId })
                .getMany();
        } catch (error) {
            throw error;
        }
    }

    async deleteAndSave(
        profileId: number,
        menuPermissionProfileDto: MenuPermissionProfileDto[]
    ) {
        try {
            const connection = await DatabaseProvider.getConnection();

            await connection
                .createQueryBuilder()
                .delete()
                .from(MenuPermissionProfile)
                .where('profileId = :profileId', {
                    profileId
                })
                .execute();

            const result: any = await connection
                .createQueryBuilder()
                .insert()
                .into(MenuPermissionProfile)
                .values(menuPermissionProfileDto)
                .execute();
            Logger.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
