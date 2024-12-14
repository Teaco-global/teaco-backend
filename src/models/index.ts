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
import Room from "./room";
import RoomUserWorkspaces from "./roomUserWorkspace";
import Message from "./message";

const Model = {
  Column,
  IdentityVerification,
  Issue,
  IssueUserWorkspace,
  Message,
  Project,
  ProjectUserWorkspace,
  Role,
  Room,
  RoomUserWorkspaces,
  Sprint,
  User,
  UserRole,
  UserWorkspace,
  UserWorkspaceRole,
  Workspace,
};

export default Model;
