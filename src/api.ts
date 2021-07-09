import AuthService, { AuthProviderType } from './services/auth/AuthService';
import DatabaseService, {
    DatabaseProviderType,
} from './services/database/DatabaseService';

export const authService = new AuthService(AuthProviderType.Firebase);
export const databaseService = new DatabaseService(
    DatabaseProviderType.Firestore
);
