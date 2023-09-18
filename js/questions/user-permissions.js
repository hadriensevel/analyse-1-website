// ----------------------------------
// USER PERMISSIONS
// ----------------------------------

import {UserRole} from './utils.js';

class UserPermissions {
  constructor({userRole, isAdmin, isAuthor = false}) {
    this.userRole = userRole;
    this.isAdmin = isAdmin;
    this.isAuthor = isAuthor;
  }

  canEditQuestion() {
    return this.isAdmin || this.userRole === UserRole.TEACHER || this.userRole === UserRole.ASSISTANT || this.isAuthor;
  }

  canLockQuestion() {
    return this.isAdmin || this.userRole === UserRole.TEACHER;
  }

  canDeleteQuestion() {
    return this.isAdmin || this.userRole === UserRole.TEACHER || this.userRole === UserRole.ASSISTANT;
  }

  canEditAnswer() {
    return this.isAdmin || this.userRole === UserRole.TEACHER || this.userRole === UserRole.ASSISTANT || this.isAuthor;
  }

  canAcceptAnswer() {
    return this.isAdmin || this.userRole === UserRole.TEACHER || this.userRole === UserRole.ASSISTANT;
  }

  canDeleteAnswer() {
    return this.isAdmin || this.userRole === UserRole.TEACHER || this.userRole === UserRole.ASSISTANT;
  }
}

export {UserPermissions};