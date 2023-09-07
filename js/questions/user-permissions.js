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

  canViewQuestionOptions() {
    return this.isAdmin || this.isAuthor ||
      this.userRole === UserRole.ASSISTANT ||
      this.userRole === UserRole.TEACHER;
  }

  canEditQuestion() {
    return this.isAdmin || this.isAuthor ||
      this.userRole === UserRole.ASSISTANT ||
      this.userRole === UserRole.TEACHER;
  }

  canLockQuestion() {
    return this.isAdmin || this.userRole === UserRole.TEACHER;
  }

  canDeleteQuestion() {
    return this.isAdmin || this.userRole === UserRole.TEACHER;
  }

  canEditAnswer() {
    return this.isAdmin || this.userRole === UserRole.TEACHER;
  }

  canAcceptAnswer() {
    return this.isAdmin || this.userRole === UserRole.TEACHER;
  }
}

export {UserPermissions};