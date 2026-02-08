import graphene
from graphene_django import DjangoObjectType
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import (
    Organization,
    Project,
    Task,
    TaskComment,
    ProjectStatus,
    TaskStatus,
)


# -----------------------------
# GraphQL Types
# -----------------------------
class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ("id", "name", "slug", "contact_email")

class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_task_count = graphene.Int()
    completion_rate = graphene.Float()

    class Meta:
        model = Project
        fields = (
            "id",
            "name",
            "description",
            "status",
            "due_date",
            "created_at",
            "organization",
        )

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_task_count(self, info):
        return self.tasks.filter(status=TaskStatus.DONE.value).count()

    def resolve_completion_rate(self, info):
        total = self.tasks.count()
        if total == 0:
            return 0.0
        completed = self.tasks.filter(status=TaskStatus.DONE.value).count()
        return round((completed / total) * 100, 2)

class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = (
            "id",
            "content",
            "author_email",
            "created_at",
        )
    
class TaskType(DjangoObjectType):
    comments = graphene.List(TaskCommentType)

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "status",
            "assignee_email",
            "due_date",
            "created_at",
            "project",
        )

    def resolve_comments(self, info):
        return self.comments.all()

class Query(graphene.ObjectType):
    organizations = graphene.List(OrganizationType)

    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
    )

    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
    )

    # -----------------------------
    # Resolvers
    # -----------------------------

    def resolve_organizations(self, info):
        return Organization.objects.all()

    def resolve_projects(self, info, organization_slug):
        return Project.objects.filter(
            organization__slug=organization_slug
        )

    def resolve_tasks(self, info, project_id):
        return Task.objects.filter(
            project_id=project_id
        )

class CreateOrganization(graphene.Mutation):
    organization = graphene.Field(OrganizationType)

    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    def mutate(self, info, name, contact_email):
        base_slug = slugify(name)
        slug = base_slug
        i = 1
        while Organization.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{i}"
            i += 1

        org = Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email,
        )
        return CreateOrganization(organization=org)

class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, organization_slug, name, description=None, status=None, due_date=None):
        organization = get_object_or_404(
            Organization, slug=organization_slug
        )

        project = Project.objects.create(
            organization=organization,
            name=name,
            description=description or "",
            status=status or ProjectStatus.ACTIVE.value,
            due_date=due_date,
        )

        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, project_id, **kwargs):
        project = get_object_or_404(Project, id=project_id)

        if "status" in kwargs and kwargs["status"] is not None:
            kwargs["status"] = kwargs["status"]

        for field, value in kwargs.items():
            if value is not None:
                setattr(project, field, value)

        project.save()
        return UpdateProject(project=project)

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()
        status = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, **kwargs):
        project = get_object_or_404(Project, id=project_id)

        task = Task.objects.create(
            project=project,
            title=title,
            description=kwargs.get("description", ""),
            assignee_email=kwargs.get("assignee_email", ""),
            status=kwargs.get("status", TaskStatus.TODO.value),
            due_date=kwargs.get("due_date"),
        )

        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)

    def mutate(self, info, task_id, **kwargs):
        task = get_object_or_404(Task, id=task_id)

        for field, value in kwargs.items():
            if value is not None:
                setattr(task, field, value)

        task.save()
        return UpdateTask(task=task)

class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(lambda: graphene.String)

    def mutate(self, info, task_id, content, author_email):
        task = get_object_or_404(Task, id=task_id)

        TaskComment.objects.create(
            task=task,
            content=content,
            author_email=author_email,
        )

        return AddTaskComment(comment="Comment added successfully")

class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_task_comment = AddTaskComment.Field()
    
schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
