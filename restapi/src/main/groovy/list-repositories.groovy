import groovy.json.JsonBuilder
import groovy.json.JsonOutput

/**
 * An example script that handles adding or updating a groovy script via the REST API.
 */

return JsonOutput.toJson(
        repository.repositoryManager.browse().collect {
            ["name": it.name, "type": it.type.value, "format": it.format.value, "url": it.url]
        }
)
