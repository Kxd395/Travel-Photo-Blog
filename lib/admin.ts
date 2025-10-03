/**
 * Admin Access Control Helpers
 * 
 * These functions determine who has access to admin features.
 * Users are authorized based on their email address.
 */

/**
 * Check if an email address is in the admin allow list
 * 
 * @param email - User's email address
 * @returns true if user is an admin
 * 
 * @example
 * ```ts
 * const session = await getServerSession(authOptions);
 * if (isAdmin(session?.user?.email)) {
 *   // User can access admin features
 * }
 * ```
 */
export function isAdmin(email?: string | null): boolean {
  if (!email) return false;

  const allowList = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return allowList.includes(email.toLowerCase());
}

/**
 * Check if an email address is in the editor allow list
 * 
 * Editors have content management permissions but not full admin access
 * 
 * @param email - User's email address
 * @returns true if user is an editor
 * 
 * @example
 * ```ts
 * const session = await getServerSession(authOptions);
 * if (isEditor(session?.user?.email)) {
 *   // User can edit content
 * }
 * ```
 */
export function isEditor(email?: string | null): boolean {
  if (!email) return false;

  const allowList = (process.env.EDITOR_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return allowList.includes(email.toLowerCase());
}

/**
 * Check if user has any content management permissions
 * (admin or editor)
 * 
 * @param email - User's email address
 * @returns true if user can manage content
 */
export function canManageContent(email?: string | null): boolean {
  return isAdmin(email) || isEditor(email);
}

/**
 * Get user's role based on email
 * 
 * @param email - User's email address
 * @returns Role string: 'admin', 'editor', or 'viewer'
 */
export function getUserRole(email?: string | null): 'admin' | 'editor' | 'viewer' {
  if (isAdmin(email)) return 'admin';
  if (isEditor(email)) return 'editor';
  return 'viewer';
}

/**
 * Assert that user is an admin, throw error if not
 * Useful for API routes that require admin access
 * 
 * @param email - User's email address
 * @throws Error if user is not an admin
 * 
 * @example
 * ```ts
 * export async function DELETE(req: Request) {
 *   const session = await getServerSession(authOptions);
 *   assertAdmin(session?.user?.email); // Throws if not admin
 *   
 *   // ... proceed with deletion
 * }
 * ```
 */
export function assertAdmin(email?: string | null): asserts email is string {
  if (!isAdmin(email)) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Assert that user can manage content, throw error if not
 * 
 * @param email - User's email address
 * @throws Error if user cannot manage content
 */
export function assertCanManageContent(email?: string | null): asserts email is string {
  if (!canManageContent(email)) {
    throw new Error('Unauthorized: Content management access required');
  }
}
