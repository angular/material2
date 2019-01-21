"""
  Implementation of the "package_docs_content" rule. The implementation runs the
  packager executable in order to group all specified files into the given sections.
"""
def _package_docs_content(ctx):
  # Directory that will contain all grouped input files. This directory will be created
  # relatively to the current target package. (e.g. "bin/src/material-examples/docs-content")
  output_dir = ctx.attr.name;

  # Arguments that will be passed to the packager executable.
  args = ctx.actions.args()

  # List of outputs that should be generated by the packager action. Bazel will automatically
  # throw an error if any output has not been generated properly.
  expected_outputs = [];

  # Support passing arguments through a parameter file. This is necessary because on Windows
  # there is an argument limit and we need to handle a large amount of input files. Bazel
  # switches between parameter file and normal argument passing based on the operating system.
  # Read more here: https://docs.bazel.build/versions/master/skylark/lib/Args.html#use_param_file
  args.use_param_file(param_file_arg = "--param-file=%s")

  # Walk through each defined input target and the associated section and compute the
  # output file which will be added to the executable arguments.
  for input_target, section_name in ctx.attr.srcs.items():
    section_files = input_target.files.to_list()

    for input_file in section_files:
      # For each input file, we want to create a copy that is stored in the output directory
      # within its specified section. e.g. "pkg_bin/docs-content/guides/getting-started.html"
      output_file = ctx.actions.declare_file(
          "%s/%s/%s" % (output_dir, section_name, input_file.basename))

      # Add the output file to the expected outputs so that Bazel throws an error if the file
      # hasn't been generated properly.
      expected_outputs += [output_file]

      # Pass the input file path and the output file path to the packager executable. We need
      # to do this for each file because we cannot determine the general path to the output
      # directory in a reliable way because Bazel targets cannot just "declare" a directory.
      # See: https://docs.bazel.build/versions/master/skylark/lib/actions.html
      args.add("%s,%s" % (input_file.path, output_file.path))

  # Do nothing if there are no input files. Bazel will throw if we schedule an action
  # that returns no outputs.
  if not ctx.files.srcs:
    return None

  # Run the packager executable that groups the specified source files and writes them
  # to the given output directory.
  ctx.actions.run(
    inputs = ctx.files.srcs,
    executable = ctx.executable._packager,
    outputs = expected_outputs,
    arguments = [args],
    progress_message = "PackageDocsContent",
  )

  return DefaultInfo(files = depset(expected_outputs))

"""
  Rule definition for the "package_docs_content" rule that can accept arbritary source files
  that will be grouped into specified sections. This is being used to package the docs
  content into a desired folder structure that can be shared with the docs application.
"""
package_docs_content = rule(
  implementation = _package_docs_content,
  attrs = {
    # This defines the sources for the "package_docs_content" rule. Instead of just
    # accepting a list of labels, this rule requires the developer to specify a label
    # keyed dictionary. This allows developers to specify where specific targets
    # should be grouped into. This helpful when publishing the docs content because
    # the docs repository does not about the directory structure of the generated files.
    "srcs": attr.label_keyed_string_dict(allow_files = True),

    # Executable for this rule that is responsible for packaging the specified
    # targets into the associated sections.
    "_packager": attr.label(
      default = Label("//tools/package-docs-content"),
      executable = True,
      cfg = "host"
  )},
)
