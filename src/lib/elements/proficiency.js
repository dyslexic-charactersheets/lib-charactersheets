export let proficiency = {
  name: 'proficiency',
  key: 'proficiency',
  defaults: {
    proficiency: "untrained",
    content: false,
    contents: []
  },
  transform(args) {
    if (args.proficiency === null) args.proficiency = "untrained";
    const icon = (args.proficiency == "untrained") ? "proficiency" : "proficiency-" + args.proficiency;

    const contents = args.content ? { type: "p", content: args.content } : { type: "g", contents: args.contents };
    return [
      {
        type: "layout",
        layout: "indent-l",
        contents: [
          {
            type: "icon",
            icon: icon
          },
          contents
        ]
      }
    ]
  }
}
