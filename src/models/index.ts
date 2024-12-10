import Role from "./role";
import UserRole from "./userRole";
import User from "./user";
import UserWorkspace from "./userWorkspace";
import UserWorkspaceRole from "./userWorkspaceRole";
import Workspace from "./workspace";
import Project from "./projects";
import ProjectUserWorkspace from "./projectUserWorkspace";
import Sprint from "./sprint";
import Issue from "./issue";
import Column from "./columns";
import IssueUserWorkspace from "./issueUserWorkspace";
import IdentityVerification from "./indentityVerification";

const Model = {
  IdentityVerification,
  Issue,
  IssueUserWorkspace,
  Project,
  ProjectUserWorkspace,
  Role,
  Sprint,
  Column,
  User,
  UserRole,
  UserWorkspace,
  UserWorkspaceRole,
  Workspace,
};

export default Model;
