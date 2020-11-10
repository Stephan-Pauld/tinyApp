let template =  (templateVars) => {
  return `<p>Hello ${templateVars.name}</p>`
}



console.log(template({name: "Stephan"}));