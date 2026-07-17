import { config, fields, collection, singleton } from "@keystatic/core";

/**
 * Content model for the Health Inequalities Team site.
 *
 * Publications are pulled automatically from OpenAlex using each person's
 * identifier (see the People collection). This Keystatic config only holds the
 * things a human curates: people, presentations, homepage copy, a pinned
 * publication, a hidden-DOI list, and any manual publications OpenAlex misses.
 *
 * storage: { kind: "local" } writes files into this repo during dev.
 * For live team editing after deploy, switch to GitHub storage — see MOVING.md.
 */
export default config({
  storage: {
  kind: "github",
  repo: { owner: "cwall96", name: "health-inequalities-site" },
},

  ui: {
    brand: { name: "Health Inequalities Team" },
  },

  singletons: {
    home: singleton({
    label: "Homepage & settings",
    path: "src/content/home/index",
    format: { data: "json" },
    schema: {
      eyebrow: fields.text({
        label: "Hero eyebrow",
        defaultValue: "Population Health Sciences Institute, Newcastle University",
      }),
      heading: fields.text({ label: "Hero heading", defaultValue: "Health Inequalities Team" }),
      intro: fields.text({
        label: "Hero intro (short line under the title)",
        multiline: true,
        defaultValue:
          "We study how where you live shapes how long and how well you live, and what policy can do to close the gap.",
      }),
      aboutHeading: fields.text({
        label: "About heading",
        defaultValue: "Understanding and reducing health inequalities",
      }),
      aboutBody: fields.text({
        label: "About text (one or more paragraphs)",
        multiline: true,
        defaultValue:
          "The Health Inequalities Team is based in the Population Health Sciences Institute at Newcastle University. We research why health outcomes differ so sharply between places and social groups, and what policy can do to close those gaps, across the social, economic and political determinants of health.\n\nThe team is led by Clare Bambra, Professor of Public Health. Clare is a Fellow of the Academy of Medical Sciences, a member of the German National Academy of Sciences (Leopoldina), an NIHR Senior Investigator, and a founding co-Director of Health Equity North. Much of her work centres on England's north and south health divide and the ways place shapes how long and how well people live.\n\nWe lead and contribute to major national and international collaborations, including a Wellcome Trust funded programme on regional health inequalities and CHAIN, the Centre for Global Health Inequalities Research in Norway. The team also advises WHO Europe on health equity, and supervises master's and doctoral researchers working across health inequalities.",
      }),
      featuredDoi: fields.text({
        label: "Featured publication DOI (homepage)",
        description: "Paste a DOI to pin one paper. Leave blank to show the newest.",
      }),
      hiddenDois: fields.array(fields.text({ label: "DOI" }), {
        label: "Hidden DOIs",
        description: "DOIs to hide from the Publications page.",
        itemLabel: (props) => props.value || "DOI",
      }),
    },
  }),
  },

  collections: {
    team: collection({
      label: "People",
      slugField: "name",
      path: "src/content/team/*",
      format: { data: "json" },
      columns: ["name", "role", "category"],
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Role / title" }),
        category: fields.select({
          label: "Category",
          options: [
          { label: "Staff", value: "staff" },
          { label: "PhD student", value: "phd" },
          { label: "Professional services", value: "services" },
        ],
        defaultValue: "staff",
        }),
        photo: fields.image({
          label: "Photo",
          directory: "public/images/team",
          publicPath: "/images/team/",
        }),
        email: fields.text({ label: "Email", validation: { isRequired: false } }),
        bio: fields.text({ label: "Short bio", multiline: true }),
        identifier: fields.text({
          label: "Publication identifier",
          description:
            "For auto-pulling publications from OpenAlex. Preferred: ORCID iD (e.g. 0000-0002-1825-0097). Also accepts an OpenAlex author ID (e.g. A5023888391) or, as a last resort, the person's full name.",
        }),
        order: fields.integer({ label: "Sort order", defaultValue: 0 }),
      },
    }),

    publications: collection({
      label: "Manual publications",
      slugField: "title",
      path: "src/content/publications/*",
      format: { data: "json" },
      columns: ["title", "year", "venue"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        authors: fields.text({ label: "Authors" }),
        year: fields.integer({ label: "Year", defaultValue: new Date().getFullYear() }),
        venue: fields.text({ label: "Journal / venue" }),
        url: fields.url({ label: "DOI / URL", validation: { isRequired: false } }),
      },
    }),

    presentations: collection({
      label: "Presentations",
      slugField: "title",
      path: "src/content/presentations/*",
      format: { data: "json" },
      columns: ["title", "date", "section"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date" }),
        venue: fields.text({ label: "Venue / details", validation: { isRequired: false } }),
        section: fields.select({
          label: "Section",
          options: [
            { label: "National inquiries", value: "inquiry" },
            { label: "Conferences and seminars", value: "conference" },
            { label: "Media coverage", value: "media" },
          ],
          defaultValue: "conference",
        }),
        link: fields.url({ label: "Link", validation: { isRequired: false } }),
      },
    }),
  },
});
