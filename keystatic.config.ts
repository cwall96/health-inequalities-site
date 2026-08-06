import {
  config,
  fields,
  collection,
  singleton,
} from "@keystatic/core";

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

        role: fields.text({
          label: "Role / title",
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
          label: "Research keywords",
          description:
            "A short comma-separated list shown on the People page.",
          validation: {
            isRequired: false,
          },
        }),

        bio: fields.text({
          label: "Short bio",
          multiline: true,
        }),

        identifier: fields.text({
          label: "Publication identifier",
          description:
            "Preferred: ORCID iD. Also accepts an OpenAlex author ID or the person's full name.",
        }),

        order: fields.integer({
          label: "Sort order",
          defaultValue: 0,
        }),
      },
    }),

    publications: collection({
      label: "Manual publications",
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

    presentations: collection({
      label: "Presentations",
      slugField: "title",
      path: "src/content/presentations/*",
      format: {
        data: "json",
      },
      columns: ["title", "date", "section"],

      schema: {
        title: fields.slug({
          name: {
            label: "Title",
          },
        }),

        date: fields.date({
          label: "Date",
        }),

        venue: fields.text({
          label: "Venue / details",
          validation: {
            isRequired: false,
          },
        }),

        section: fields.select({
          label: "Section",
          options: [
            {
              label: "National inquiries",
              value: "inquiry",
            },
            {
              label: "Conferences and seminars",
              value: "conference",
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
          label: "Study lead",
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
      label: "News",
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