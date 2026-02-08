import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ORGANIZATIONS } from "../graphql/queries/organizations";
import { CREATE_ORGANIZATION } from "../graphql/mutations/createOrganization";
import Modal from "./ui/Modal";

type Organization = {
  id: string;
  name: string;
  slug: string;
};

type GetOrganizationsData = {
  organizations: Organization[];
};

type CreateOrganizationResult = {
  createOrganization: {
    organization: {
      id: string;
      name: string;
      slug: string;
      contactEmail: string;
    };
  };
};

type CreateOrganizationVars = {
  name: string;
  contactEmail: string;
};

export default function OrganizationSwitcher() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const { data, loading, error } =
    useQuery<GetOrganizationsData>(GET_ORGANIZATIONS);

  const [createOrganization, { loading: creating }] =
    useMutation<CreateOrganizationResult, CreateOrganizationVars>(
      CREATE_ORGANIZATION,
      {
        onCompleted: (data) => {
          const org = data.createOrganization.organization;
          setShowCreate(false);
          setName("");
          navigate(`/org/${org.slug}/projects`);
        },
      }
    );

  if (loading || error || !data) return null;

  const currentOrg = data.organizations.find(
    (org) => org.slug === orgSlug
  );

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          rounded-lg border bg-white
          px-3 py-2 text-sm text-slate-700
          shadow-sm hover:bg-slate-50
        "
      >
        <span className="font-medium">
          {currentOrg?.name ?? "Select organization"}
        </span>
        <svg
          className="h-4 w-4 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5">
          {data.organizations.map((org) => {
            const isActive = org.slug === orgSlug;

            return (
              <button
                key={org.id}
                onClick={() => {
                  setOpen(false);
                  navigate(`/org/${org.slug}/projects`);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm transition
                  ${isActive
                    ? "bg-slate-100 font-medium"
                    : "hover:bg-slate-50"}
                `}
              >
                {org.name}
              </button>
            );
          })}

          <div className="border-t">
            <button
              onClick={() => {
                setOpen(false);
                setShowCreate(true);
              }}
              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-slate-50"
            >
              + Create organization
            </button>
          </div>
        </div>
      )}

      {/* Create organization modal */}
      {showCreate && (
        <Modal
          title="Create organization"
          onClose={() => setShowCreate(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !contactEmail.trim()) return;
              createOrganization({ variables: { name, contactEmail } });
            }}
            className="space-y-3"
          >
            <input
              autoFocus
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Contact email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />

            <button
              disabled={creating}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs text-white disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
