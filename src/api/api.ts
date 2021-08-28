import AuthService, { AuthProviderType } from '../services/AuthService';
import DatabaseService, {
    DatabaseProviderType,
} from '../services/DatabaseService';

export const authService = new AuthService(AuthProviderType.Firebase);
export const databaseService = new DatabaseService(
    DatabaseProviderType.Firestore
);
