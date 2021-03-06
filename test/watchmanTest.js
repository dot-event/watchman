/* eslint-env jest */

const dot = require("dot-event")()

require("@dot-event/log")(dot)
require("../")(dot)

describe("watchmanTrigger", function() {
  test("without command", () => {
    expect(dot.watchmanTrigger({})).rejects.toThrow(
      expect.any(Error)
    )
  })

  test("with command", async () => {
    expect(
      await dot.watchmanTrigger({ command: "ls" })
    ).toEqual({
      command: ["ls"],
      expression: ["anyof"],
      name: "default",
    })
  })

  test("with args, command, cwd, and glob", async () => {
    expect(
      await dot.watchmanTrigger({
        args: "-lah",
        command: "ls",
        glob: "*.js",
        path: `${__dirname}/fixture`,
      })
    ).toEqual({
      command: ["ls", "-lah"],
      expression: ["anyof", ["match", "*.js", "wholename"]],
      name: "fixture",
    })
  })

  test("with script", async () => {
    expect(
      await dot.watchmanTrigger({
        path: `${__dirname}/fixture`,
        script: "ls",
      })
    ).toEqual({
      command: ["npm", "run", "ls"],
      expression: [
        "anyof",
        ["match", "**/*.js", "wholename"],
        ["match", "*.jsx", "wholename"],
      ],
      name: "ls",
    })
  })
})
