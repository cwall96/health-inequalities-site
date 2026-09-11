import {
  config,
  fields,
  collection,
  singleton,
} from "@keystatic/core";

const currentProfileYear = new Date().getFullYear();

const profileYearOptions = [
  { label: "Present", value: "present" },
  ...Array.from({ length: currentProfileYear - 1979 }, (_, index) => {
    const year = String(currentProfileYear - index);
    return { label: year, value: year };
  }),
];

const courseLevelOptions = [
  { label: "PhD", value: "phd" },
  { label: "MD", value: "md" },
  { label: "MA", value: "ma" },
  { label: "MSc", value: "msc" },
  { label: "MPH", value: "mph" },
  { label: "MPharm", value: "mpharm" },
  { label: "BA", value: "ba" },
  { label: "BSc", value: "bsc" },
  { label: "MBBS", value: "mbbs" },
  { label: "Other undergraduate", value: "undergraduate" },
  { label: "Other postgraduate", value: "postgraduate" },
  { label: "Other", value: "other" },
];

/**
 * Content model for the Health Inequalities Team website.
 */
export default config({
  storage: {
    kind: "cloud",
  },

  cloud: {
    project: "hit-nlc/health-inequalities",
  },

  ui: {
    brand: {
      name: "Health Inequalities Team",
    },
  },

  singletons: {
    home: singleton({
      label: "Homepage & settings",
      path: "src/content/home/index",
      format: {
        data: "json",
      },

      schema: {
        eyebrow: fields.text({
          label: "Hero eyebrow",
          defaultValue:
            "Population Health Sciences Institute, Newcastle University",
        }),

        heading: fields.text({
          label: "Hero heading",
          defaultValue: "Health Inequalities Team",
        }),

        intro: fields.text({
          label: "Hero intro (short line under the title)",
          multiline: true,
          defaultValue:
            "We study how where you live shapes how long and how well you live, and what policy can do to close the gap.",
        }),

        inequalitiesSection: fields.object(
          {
            eyebrow: fields.text({
              label: "Small heading above the title",
              defaultValue: "Understanding the issue",
            }),

            heading: fields.text({
              label: "Section title",
              defaultValue: "What are health inequalities?",
            }),

            definitionLabel: fields.text({
              label: "Definition box label",
              defaultValue: "A working definition",
            }),

            definition: fields.text({
              label: "Definition",
              multiline: true,
              description:
                "A short plain-English definition shown in the lavender box.",
              defaultValue:
                "Health inequalities are systematic, unfair and avoidable differences in health between groups of people.",
            }),

            definitionSourceLabel: fields.text({
              label: "Definition source link text",
              description:
                "For example: Read the NHS England definition.",
              defaultValue: "Read the NHS England definition",
            }),

            definitionSourceUrl: fields.url({
              label: "Definition source web address",
              validation: {
                isRequired: false,
              },
            }),

            subsections: fields.array(
              fields.object(
                {
                  heading: fields.text({
                    label: "Subsection title",
                  }),

                  body: fields.text({
                    label: "Subsection text",
                    multiline: true,
                    description:
                      "Use a blank line if you want to start a new paragraph.",
                  }),

                  sourceLabel: fields.text({
                    label: "Source link text",
                    description:
                      "Optional. For example: The Marmot Review.",
                    validation: {
                      isRequired: false,
                    },
                  }),

                  sourceUrl: fields.url({
                    label: "Source web address",
                    validation: {
                      isRequired: false,
                    },
                  }),
                },
                {
                  label: "Background subsection",
                  description:
                    "A short explanation of a concept or theory, with an optional source.",
                },
              ),
              {
                label: "Background subsections",
                description:
                  "Add, remove or reorder the concepts shown beneath the definition.",
                itemLabel: (props) =>
                  props.fields.heading.value || "New subsection",
              },
            ),
          },
          {
            label: "What are health inequalities? section",
            description:
              "Edit the homepage definition and add or reorder background concepts without changing any code.",
          },
        ),

        aboutHeading: fields.text({
          label: "About heading",
          defaultValue:
            "Understanding and reducing health inequalities",
        }),

        aboutBody: fields.text({
          label: "About text (one or more paragraphs)",
          multiline: true,
          defaultValue:
            "The Health Inequalities Team is based in the Population Health Sciences Institute at Newcastle University. We research why health outcomes differ so sharply between places and social groups, and what policy can do to close those gaps, across the social, economic and political determinants of health.\n\nThe team is led by Clare Bambra, Professor of Public Health. Clare is a Fellow of the Academy of Medical Sciences, a member of the German National Academy of Sciences (Leopoldina), an NIHR Senior Investigator, and a founding co-Director of Health Equity North. Much of her work centres on England's north and south health divide and the ways place shapes how long and how well people live.\n\nWe lead and contribute to major national and international collaborations, including a Wellcome Trust funded programme on regional health inequalities and CHAIN, the Centre for Global Health Inequalities Research in Norway. The team also advises WHO Europe on health equity, and supervises master's and doctoral researchers working across health inequalities.",
        }),

        highlightHeading: fields.text({
          label: "Highlight heading",
          defaultValue: "Highlights",
        }),

        highlightBody: fields.text({
          label: "Highlight text",
          multiline: true,
          description:
            "Shown in the coloured highlight box on the homepage.",
          defaultValue:
            "This is where the team highlight can go",
        }),

        citationFallback: fields.integer({
          label: "Last known citation total",
          description:
            "Used only when OpenAlex is temporarily unavailable, so the homepage never incorrectly displays zero citations.",
          defaultValue: 22669,
        }),

        metricsUpdatedDate: fields.date({
          label: "Last known citation update date",
          description:
            "The date on which the fallback citation total was last checked.",
          defaultValue: {
            kind: "today",
          },
        }),

        projectDescription: fields.text({
          label: "Research projects description",
          multiline: true,
          description:
            "This appears beside the project links on the Research page.",
          defaultValue:
            "Our projects bring together researchers, practitioners and communities to understand and address inequalities in health.",
        }),

        featuredDoi: fields.text({
          label: "Featured publication DOI (homepage)",
          description:
            "Paste a DOI to pin one paper. Leave blank to show the newest.",
        }),

        hiddenDois: fields.array(
          fields.text({
            label: "DOI",
          }),
          {
            label: "Hidden DOIs",
            description:
              "DOIs to hide from the Publications page.",
            itemLabel: (props) => props.value || "DOI",
          },
        ),
      },
    }),
  },

  collections: {
    researchThemes: collection({
      label: "Research themes",
      slugField: "name",
      path: "src/content/research-themes/*",
      format: {
        data: "json",
      },
      columns: ["name", "order"],

      schema: {
        name: fields.slug({
          name: {
            label: "Theme name",
          },
        }),

        description: fields.text({
          label: "Short description",
          multiline: true,
          validation: {
            isRequired: false,
          },
        }),

        publicationKeywords: fields.array(
          fields.text({
            label: "Matching term",
          }),
          {
            label: "Automatic publication matching terms",
            description:
              "Add phrases that commonly appear in publication titles or OpenAlex topics for this theme. Add each phrase once; all matching publications will be tagged automatically.",
          },
        ),

        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers appear first in theme filters.",
          defaultValue: 0,
        }),
      },
    }),

    team: collection({
      label: "People",
      slugField: "name",
      path: "src/content/team/*",
      format: {
        data: "json",
      },
      columns: ["name", "role", "category"],

      schema: {
        name: fields.slug({
          name: {
            label: "Name",
          },
        }),

        displayName: fields.text({
          label: "Full display name",
          description:
            "Include titles and qualifications exactly as they should appear in the navy profile box, for example Dr Amber Sacre, PhD.",
          validation: {
            isRequired: false,
          },
        }),

        role: fields.text({
          label: "Role / title",
        }),

        profileSubtitle: fields.text({
          label: "Profile subtitle (optional)",
          description:
            "Add a short personalised line to appear above the person's name. If left blank, their team category is shown.",
          validation: {
            isRequired: false,
          },
        }),

        category: fields.select({
          label: "Category",
          options: [
            {
              label: "Team lead",
              value: "lead",
            },
            {
              label: "Senior team member",
              value: "senior",
            },
            {
              label: "Early career researcher",
              value: "ecr",
            },
            {
              label: "PhD student",
              value: "phd",
            },
            {
              label: "Team administration",
              value: "services",
            },
            {
              label: "Staff (choose a new group)",
              value: "staff",
            },
          ],
          defaultValue: "ecr",
        }),

        photo: fields.image({
          label: "Photo",
          directory: "public/images/team",
          publicPath: "/images/team/",
        }),

        email: fields.text({
          label: "Email",
          validation: {
            isRequired: false,
          },
        }),

        researchKeywords: fields.text({
          label: "Main research theme tags",
          description:
            "Enter short research themes separated by commas. These appear as tags in the navy profile box.",
          validation: {
            isRequired: false,
          },
        }),

        bio: fields.text({
          label: "Profile summary",
          description:
            "Write two or three sentences introducing the person and their work. This appears near the top of their profile.",
          multiline: true,
        }),

        researchFocus: fields.text({
          label: "Research focus",
          description:
            "What topics, populations or health inequalities does this person study?",
          multiline: true,
          validation: {
            isRequired: false,
          },
        }),

        researchActivity: fields.array(
          fields.object({
            projectTitle: fields.text({
              label: "Project title",
            }),
            teamCollaborators: fields.array(
              fields.relationship({
                label: "HIT collaborator",
                collection: "team",
              }),
              {
                label: "HIT collaborators",
                description:
                  "Select collaborators who have a profile on this website. Their names will link to their profiles.",
              },
            ),
            otherCollaborators: fields.array(
              fields.text({
                label: "Collaborator name",
              }),
              {
                label: "Other collaborators",
                description:
                  "Type the name of each collaborator who is not in the HIT team.",
                itemLabel: (props) => props.value || "New collaborator",
              },
            ),
            year: fields.integer({
              label: "Year",
              description:
                "For ongoing work, use the year the activity started.",
              validation: {
                isRequired: false,
              },
            }),
            status: fields.select({
              label: "Status",
              options: [
                { label: "Ongoing", value: "ongoing" },
                { label: "Completed", value: "completed" },
              ],
              defaultValue: "ongoing",
            }),
            funder: fields.text({
              label: "Funder",
              validation: {
                isRequired: false,
              },
            }),
            summary: fields.text({
              label: "Summary",
              multiline: true,
              description:
                "Add one or two sentences describing the activity.",
            }),
          }),
          {
            label: "Research activity",
            description:
              "Use this for smaller studies or projects that do not need their own study page.",
            itemLabel: (props) =>
              props.fields.projectTitle.value || "New research activity",
          },
        ),

        professionalRoles: fields.array(
          fields.object({
            title: fields.text({
              label: "Role or membership title",
              description:
                "For example Head of EDI, committee member or Fellow.",
            }),
            organisation: fields.text({
              label: "Organisation",
              description:
                "For example Newcastle School of Pharmacy.",
              validation: {
                isRequired: false,
              },
            }),
            type: fields.select({
              label: "Type",
              options: [
                { label: "Leadership role", value: "leadership" },
                { label: "Committee or advisory role", value: "committee" },
                { label: "Professional membership or fellowship", value: "membership" },
                { label: "Clinical role", value: "clinical" },
                { label: "Editorial role", value: "editorial" },
                { label: "Research network or collaboration", value: "research" },
                { label: "Other", value: "other" },
              ],
              defaultValue: "other",
            }),
            startYear: fields.text({
              label: "Start year (optional)",
              validation: {
                isRequired: false,
              },
            }),
            endYear: fields.text({
              label: "End year (optional)",
              description: "Enter Present if the role is current.",
              validation: {
                isRequired: false,
              },
            }),
          }),
          {
            label: "Professional roles and memberships",
            description:
              "Add each additional role, committee, fellowship, network or membership as a separate entry.",
            itemLabel: (props) =>
              props.fields.title.value || "New professional role",
          },
        ),

        teaching: fields.array(
          fields.object({
            course: fields.text({
              label: "Course",
              description:
                "Enter the degree or programme name, for example Master of Public Health.",
            }),
            module: fields.text({
              label: "Module",
              description:
                "Enter the module name if applicable. Leave blank for course-level teaching.",
              validation: {
                isRequired: false,
              },
            }),
            level: fields.select({
              label: "Level",
              options: courseLevelOptions,
              defaultValue: "other",
            }),
            fromYear: fields.select({
              label: "From year",
              options: profileYearOptions.slice(1),
              defaultValue: String(currentProfileYear),
            }),
            toYear: fields.select({
              label: "To year",
              description: "Choose Present if the teaching is ongoing.",
              options: profileYearOptions,
              defaultValue: "present",
            }),
          }),
          {
            label: "Teaching",
            description:
              "Add each course and module as a separate teaching entry.",
            itemLabel: (props) =>
              props.fields.module.value ||
              props.fields.course.value ||
              "New teaching entry",
          },
        ),

        supervision: fields.array(
          fields.object({
            studentName: fields.text({
              label: "Student name",
            }),
            fromYear: fields.select({
              label: "From year",
              options: profileYearOptions.slice(1),
              defaultValue: String(currentProfileYear),
            }),
            toYear: fields.select({
              label: "To year",
              description:
                "Choose Present if the supervision is ongoing.",
              options: profileYearOptions,
              defaultValue: "present",
            }),
            qualification: fields.select({
              label: "Qualification",
              options: courseLevelOptions,
              defaultValue: "phd",
            }),
            projectTitle: fields.text({
              label: "Course / project title",
              multiline: true,
            }),
          }),
          {
            label: "Supervision",
            description:
              "Add each supervised student as a separate entry. Use the controls to change their order.",
            itemLabel: (props) =>
              props.fields.studentName.value || "New supervision entry",
          },
        ),

        methodsExpertise: fields.array(
          fields.text({
            label: "Skill or area of expertise",
          }),
          {
            label: "Skills",
            description:
              "Add each research method, practical skill or area of expertise as a separate item.",
            itemLabel: (props) => props.value || "New skill",
          },
        ),

        orcid: fields.text({
          label: "ORCID iD",
          description:
            "Enter the 16-character ORCID iD, for example 0000-0002-1825-0097. It will become a clickable link.",
          validation: {
            isRequired: false,
          },
        }),

        identifier: fields.text({
          label: "Publication data identifier (advanced)",
          description:
            "Used to find publications automatically. This may be an ORCID iD, an OpenAlex author ID or the person's full name.",
        }),

        order: fields.integer({
          label: "Sort order",
          defaultValue: 0,
        }),
      },
    }),

    publications: collection({
      label: "Publications (manual additions)",
      slugField: "title",
      path: "src/content/publications/*",
      format: {
        data: "json",
      },
      columns: ["title", "year", "venue"],

      schema: {
        title: fields.slug({
          name: {
            label: "Title",
          },
        }),

        authors: fields.text({
          label: "Authors",
        }),

        teamMembers: fields.array(
          fields.relationship({
            label: "Team member",
            collection: "team",
          }),
          {
            label: "HIT team members",
            description:
              "Select every HIT member who contributed, regardless of author order. Their names will link to their People profiles.",
          },
        ),

        researchThemes: fields.array(
          fields.relationship({
            label: "Research theme",
            collection: "researchThemes",
          }),
          {
            label: "Research themes",
            description:
              "Select from the same themes used for studies. Add new options in the Research themes collection first.",
          },
        ),

        year: fields.integer({
          label: "Year",
          defaultValue: new Date().getFullYear(),
        }),

        venue: fields.text({
          label: "Journal / venue",
        }),

        url: fields.url({
          label: "DOI / URL",
          validation: {
            isRequired: false,
          },
        }),
      },
    }),

    publicationTags: collection({
      label: "Publication tag corrections (optional)",
      slugField: "label",
      path: "src/content/publication-tags/*",
      format: {
        data: "json",
      },
      columns: ["label", "doi"],

      schema: {
        label: fields.slug({
          name: {
            label: "Publication title",
            description:
              "Only use this optional collection when the automatic theme or person matching needs correcting.",
          },
        }),

        doi: fields.text({
          label: "DOI",
          description:
            "Paste the DOI for an automatically imported publication, for example 10.1234/example. The tags below will then be attached to that publication.",
        }),

        teamMembers: fields.array(
          fields.relationship({
            label: "Team member",
            collection: "team",
          }),
          {
            label: "HIT team members",
            description:
              "Select every HIT member who contributed, regardless of author order.",
          },
        ),

        researchThemes: fields.array(
          fields.relationship({
            label: "Research theme",
            collection: "researchThemes",
          }),
          {
            label: "Research themes",
            description:
              "Select from the same shared themes used for studies.",
          },
        ),
      },
    }),

    
    presentations: collection({
  label: "Presentations & Posters",
  slugField: "title",
  path: "src/content/presentations/*",
  format: {
    data: "json",
  },
  columns: [
    "title",
    "date",
    "section",
  ],

  schema: {
    title: fields.slug({
      name: {
        label: "Title",
      },
    }),

    authors: fields.text({
      label: "Other authors",
      description:
        "Enter authors who are not members of HIT, in the order they should appear. Linked HIT team members are selected separately below and are displayed first as tags.",
      multiline: true,
      validation: {
        isRequired: false,
      },
    }),

    date: fields.date({
      label: "Date",
      validation: {
        isRequired: false,
      },
    }),

    peopleSummary: fields.text({
      label: "People-page description",
      description:
        "Write one short sentence explaining this output. It appears only in related-work lists on People profiles.",
      validation: {
        isRequired: false,
      },
    }),

    venue: fields.text({
      label: "Conference / venue / details",
      validation: {
        isRequired: false,
      },
    }),

    coverImage: fields.image({
      label: "Card preview image",
      description:
        "Upload a smaller preview for the gallery card. For a poster, this can be the same image as the full poster if needed.",
      directory: "public/images/presentations",
      publicPath: "/images/presentations/",
      validation: {
        isRequired: false,
      },
    }),

    posterImage: fields.image({
      label: "Full-resolution poster image",
      description:
        "For posters only. Upload a clear portrait image of the complete poster. Large A3 or A2 exports are suitable; PNG, JPEG or WebP work best.",
      directory: "public/images/presentations",
      publicPath: "/images/presentations/",
      validation: {
        isRequired: false,
      },
    }),

    section: fields.select({
      label: "Content type",
      options: [
        {
          label: "National inquiry presentation",
          value: "inquiry",
        },
        {
          label: "Conference or seminar presentation",
          value: "conference",
        },
        {
          label: "Poster",
          value: "poster",
        },
        {
          label: "Media coverage",
          value: "media",
        },
      ],
      defaultValue: "conference",
    }),

    link: fields.url({
      label: "Link",
      validation: {
        isRequired: false,
      },
    }),

    abstractLink: fields.url({
      label: "Abstract link",
      description:
        "For posters, link to the conference abstract, proceedings entry or abstract webpage.",
      validation: {
        isRequired: false,
      },
    }),

    teamMembers: fields.array(
      fields.relationship({
        label: "Team member",
        collection: "team",
      }),
      {
        label: "HIT team members",
        description:
          "Select the people involved. Their names will link to their People profiles.",
      },
    ),
  },
}),

    impacts: collection({
      label: "Public & Policy Impact",
      slugField: "title",
      path: "src/content/impacts/*",
      format: {
        data: "json",
      },
      columns: ["title", "year", "order"],

      schema: {
        title: fields.slug({
          name: {
            label: "Impact story title",
          },
        }),

        year: fields.integer({
          label: "Year",
          defaultValue: new Date().getFullYear(),
        }),

        summary: fields.text({
          label: "What changed?",
          multiline: true,
          description:
            "Describe the change, influence or benefit rather than only listing an activity or output.",
        }),

        evidence: fields.text({
          label: "Evidence of impact",
          multiline: true,
          description:
            "Optional: briefly describe how the change is evidenced.",
          validation: {
            isRequired: false,
          },
        }),

        relatedWork: fields.text({
          label: "Related study or programme",
          validation: {
            isRequired: false,
          },
        }),

        image: fields.image({
          label: "Impact image",
          directory: "public/images/impacts",
          publicPath: "/images/impacts/",
          validation: {
            isRequired: false,
          },
        }),

        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers appear first.",
          defaultValue: 0,
        }),
      },
    }),

    recognition: collection({
      label: "Awards & Recognition",
      slugField: "title",
      path: "src/content/recognition/*",
      format: {
        data: "json",
      },
      columns: ["title", "year", "recipient", "order"],

      schema: {
        title: fields.slug({
          name: {
            label: "Award or recognition",
          },
        }),

        year: fields.integer({
          label: "Year",
          defaultValue: new Date().getFullYear(),
        }),

        recipient: fields.text({
          label: "Other recipient",
          description:
            "Optional. Use this for a study, programme, the whole team or someone who does not have a People profile.",
          validation: {
            isRequired: false,
          },
        }),

        teamMembers: fields.array(
          fields.relationship({
            label: "Team member",
            collection: "team",
          }),
          {
            label: "HIT recipients",
            description:
              "Select every HIT member who received or was named in this award. Their names will link to their People profiles.",
          },
        ),

        awardingBody: fields.text({
          label: "Awarding organisation",
        }),

        description: fields.text({
          label: "Short description",
          multiline: true,
          validation: {
            isRequired: false,
          },
        }),

        link: fields.url({
          label: "Supporting link",
          validation: {
            isRequired: false,
          },
        }),

        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers appear first.",
          defaultValue: 0,
        }),
      },
    }),

    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "src/content/projects/*",
      format: {
        contentField: "content",
      },
      columns: ["title", "status", "order"],

      schema: {
        title: fields.slug({
          name: {
            label: "Project title",
          },
        }),

        summary: fields.text({
          label: "Short summary",
          multiline: true,
          description:
            "Shown on the Research page.",
        }),

        status: fields.select({
          label: "Status",
          options: [
            {
              label: "Ongoing",
              value: "ongoing",
            },
            {
              label: "Completed",
              value: "completed",
            },
          ],
          defaultValue: "ongoing",
        }),

        lead: fields.text({
          label: "Project lead",
          validation: {
            isRequired: false,
          },
        }),

        funder: fields.text({
          label: "Funder",
          validation: {
            isRequired: false,
          },
        }),

        timeframe: fields.text({
          label: "Project dates",
          description:
            "For example, 2025–2028.",
          validation: {
            isRequired: false,
          },
        }),

        teamMembers: fields.array(
          fields.relationship({
            label: "Team member",
            collection: "team",
          }),
          {
            label: "Project team",
            description:
              "Select the HIT members involved in this research programme.",
          },
        ),

        coverImage: fields.image({
          label: "Cover image",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
          validation: {
            isRequired: false,
          },
        }),

        order: fields.integer({
          label: "Sort order",
          description:
            "Lower numbers appear first.",
          defaultValue: 0,
        }),

        content: fields.document({
          label: "Full project information",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/projects",
            publicPath: "/images/projects/",
          },
        }),
      },
    }),

    studies: collection({
      label: "Studies",
      slugField: "title",
      path: "src/content/studies/*",
      format: {
        contentField: "content",
      },
      columns: ["title", "status", "order"],

      schema: {
        title: fields.slug({
          name: {
            label: "Study title",
          },
        }),

        summary: fields.text({
          label: "Short summary",
          multiline: true,
          description:
            "Shown on the Research page study card.",
        }),

        peopleSummary: fields.text({
          label: "People-page description",
          description:
            "Write one short sentence describing the study for related-work lists on People profiles.",
          validation: {
            isRequired: false,
          },
        }),

        highlights: fields.array(
          fields.text({
            label: "Highlight",
            multiline: true,
          }),
          {
            label: "Study at a glance",
            description:
              "Add up to three short points summarising the most important features of the study.",
            validation: {
              length: {
                max: 3,
              },
            },
          },
        ),

        researchThemes: fields.array(
          fields.relationship({
            label: "Research theme",
            collection: "researchThemes",
          }),
          {
            label: "Research themes",
            description:
              "Select themes from the shared Research themes collection.",
          },
        ),

        whyItMatters: fields.object(
          {
            heading: fields.text({
              label: "Section heading",
              defaultValue: "Why this study matters",
            }),
            body: fields.text({
              label: "Section text",
              multiline: true,
              description:
                "Explain the problem or evidence gap the study addresses.",
            }),
          },
          {
            label: "Why this study matters",
          },
        ),

        approach: fields.object(
          {
            heading: fields.text({
              label: "Section heading",
              defaultValue: "What we are doing",
            }),
            body: fields.text({
              label: "Section text",
              multiline: true,
              description:
                "Describe the study design, participants, data or methods in plain English.",
            }),
          },
          {
            label: "What we are doing",
          },
        ),

        impact: fields.object(
          {
            heading: fields.text({
              label: "Section heading",
              defaultValue: "Impact and outputs",
            }),
            body: fields.text({
              label: "Section text",
              multiline: true,
              description:
                "Describe intended impact, emerging findings, outputs or completed achievements. Avoid claiming impact before it has occurred.",
            }),
          },
          {
            label: "Impact and outputs",
          },
        ),

        status: fields.select({
          label: "Status",
          options: [
            {
              label: "Ongoing",
              value: "ongoing",
            },
            {
              label: "Completed",
              value: "completed",
            },
          ],
          defaultValue: "ongoing",
        }),

        currentStage: fields.select({
          label: "Current study stage",
          description:
            "Select the furthest stage the study has reached. Earlier stages will appear as completed on the timeline.",
          options: [
            {
              label: "Protocol",
              value: "protocol",
            },
            {
              label: "Ethical approval",
              value: "ethical-approval",
            },
            {
              label: "Study set-up",
              value: "study-setup",
            },
            {
              label: "Data collection",
              value: "data-collection",
            },
            {
              label: "Data analysis",
              value: "data-analysis",
            },
            {
              label: "Dissemination",
              value: "dissemination",
            },
            {
              label: "Concluded",
              value: "concluded",
            },
          ],
          defaultValue: "protocol",
        }),

        relatedOutputs: fields.array(
          fields.object(
            {
              title: fields.text({
                label: "Output title",
              }),
              type: fields.select({
                label: "Output type",
                options: [
                  {
                    label: "Publication",
                    value: "publication",
                  },
                  {
                    label: "Presentation",
                    value: "presentation",
                  },
                  {
                    label: "Poster",
                    value: "poster",
                  },
                  {
                    label: "Media coverage",
                    value: "media",
                  },
                  {
                    label: "Other output",
                    value: "other",
                  },
                ],
                defaultValue: "publication",
              }),
              url: fields.url({
                label: "Output link",
                description:
                  "Link directly to the output, or to its location on the Publications or Presentations and Posters page.",
              }),
            },
            {
              label: "Related output",
            },
          ),
          {
            label: "Related outputs",
            description:
              "Add publications, presentations, posters or media coverage associated with this study.",
            itemLabel: (props) =>
              props.fields.title.value || "New related output",
          },
        ),

        lead: fields.text({
          label: "Study lead",
          validation: {
            isRequired: false,
          },
        }),

        teamMembers: fields.array(
          fields.relationship({
            label: "Team member",
            collection: "team",
          }),
          {
            label: "Study team",
            description:
              "Select the HIT members involved in this study.",
          },
        ),

        funder: fields.text({
          label: "Funder",
          validation: {
            isRequired: false,
          },
        }),

        timeframe: fields.text({
          label: "Study dates",
          description:
            "For example, 2026–2028.",
          validation: {
            isRequired: false,
          },
        }),

        coverImage: fields.image({
          label: "Card image",
          directory: "public/images/studies",
          publicPath: "/images/studies/",
          validation: {
            isRequired: false,
          },
        }),

        externalLink: fields.url({
          label: "External study page",
          description:
            "Optional. If added, the card links here instead of to the study page on this website.",
          validation: {
            isRequired: false,
          },
        }),

        order: fields.integer({
          label: "Sort order",
          description:
            "Lower numbers appear first.",
          defaultValue: 0,
        }),

        content: fields.document({
          label: "Full study information",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/studies",
            publicPath: "/images/studies/",
          },
        }),
      },
    }),

    news: collection({
      label: "What's New?",
      slugField: "title",
      path: "src/content/news/*",
      format: {
        contentField: "content",
      },
      columns: ["title", "publishedDate"],

      schema: {
        title: fields.slug({
          name: {
            label: "Title",
          },
        }),

        publishedDate: fields.date({
          label: "Published date",
          defaultValue: {
            kind: "today",
          },
        }),

        author: fields.text({
          label: "Author",
        }),

        summary: fields.text({
          label: "Summary",
          multiline: true,
          description:
            "One or two sentences shown in the news list.",
        }),

        coverImage: fields.image({
          label: "Cover image",
          directory: "public/images/news",
          publicPath: "/images/news/",
          validation: {
            isRequired: false,
          },
        }),

        content: fields.document({
          label: "Body",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/news",
            publicPath: "/images/news/",
          },
        }),
      },
    }),
  },
});
