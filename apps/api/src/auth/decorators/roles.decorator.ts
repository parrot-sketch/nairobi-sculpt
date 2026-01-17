import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator to attach required roles to route handlers
 * Usage: @Roles('ADMIN', 'FRONTDESK')
 */
export const Roles = (...roles: (string | string[])[]) => {
	// Support both @Roles('A','B') and @Roles(['A','B'])
	const flattened = roles.flat() as string[];
	return SetMetadata('roles', flattened);
};
