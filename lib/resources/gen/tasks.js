
var util = require('util');
var _ = require('lodash');

module.exports = function(SuperType) {

  /**
   * The _task_ is the basic object around which many operations in Asana are
   * centered. In the Asana application, multiple tasks populate the middle pane
   * according to some view parameters, and the set of selected tasks determines
   * the more detailed information presented in the details pane.
   * @class
   * @param {Dispatcher} dispatcher The API dispatcher
   */
  function Tasks(dispatcher) {
    SuperType.call(this, dispatcher);
  }
  util.inherits(Tasks, SuperType);

  
  /**
   * Creating a new task is as easy as POSTing to the `/tasks` endpoint
   * with a data block containing the fields you'd like to set on the task.
   * Any unspecified fields will take on default values.
   * 
   * Every task is required to be created in a specific workspace, and this
   * workspace cannot be changed once set. The workspace need not be set
   * explicitly if you specify a `project` or a `parent` task instead.
   * @param {Object} [data] Data for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.create = function(
      data
  ) {
    var path = util.format('/tasks');
    
    return this.dispatchPost(path, data);
  };

  /**
   * Creating a new task is as easy as POSTing to the `/tasks` endpoint
   * with a data block containing the fields you'd like to set on the task.
   * Any unspecified fields will take on default values.
   * 
   * Every task is required to be created in a specific workspace, and this
   * workspace cannot be changed once set. The workspace need not be set
   * explicitly if you specify a project or a parent task instead.
   * @param {Number} workspace The workspace to create a task in.
   * @param {Object} [data] Data for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.createInWorkspace = function(
      workspace,
      data
  ) {
    var path = util.format('/workspaces/%d/tasks', workspace);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Returns the complete task record for a single task.
   * @param {Number} task The task to get.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The requested resource
   */
  Tasks.prototype.findById = function(
      task,
      params
  ) {
    var path = util.format('/tasks/%d', task);
    
    return this.dispatchGet(path, params);
  };

  /**
   * A specific, existing task can be updated by making a PUT request on the
   * URL for that task. Only the fields provided in the `data` block will be
   * updated; any unspecified fields will remain unchanged.
   * 
   * When using this method, it is best to specify only those fields you wish
   * to change, or else you may overwrite changes made by another user since
   * you last retrieved the task.
   * 
   * Returns the complete updated task record.
   * @param {Number} task The task to update.
   * @param {Object} [data] Data for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.update = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d', task);
    
    return this.dispatchPut(path, data);
  };

  /**
   * A specific, existing task can be deleted by making a DELETE request on the
   * URL for that task. Deleted tasks go into the "trash" of the user making
   * the delete request. Tasks can be recovered from the trash within a period
   * of 30 days; afterward they are completely removed from the system.
   * 
   * Returns an empty data record.
   * @param {Number} task The task to delete.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.delete = function(
      task
  ) {
    var path = util.format('/tasks/%d', task);
    
    return this.dispatchDelete(path);
  };

  /**
   * Returns the compact task records for all tasks within the given project,
   * ordered by their priority within the project.
   * @param {Number} projectId The project in which to search for tasks.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.findByProject = function(
      projectId,
      params
  ) {
    var path = util.format('/projects/%d/tasks', projectId);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Returns the compact task records for all tasks with the given tag.
   * @param {Number} tag The tag in which to search for tasks.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.findByTag = function(
      tag,
      params
  ) {
    var path = util.format('/tags/%d/tasks', tag);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Returns the compact task records for some filtered set of tasks. Use one
   * or more of the parameters provided to filter the tasks returned.
   * @param {Object} [params] Parameters for the request
   * @option {Number} [assignee] The assignee to filter tasks on.
   * @option {Number} [workspace] The workspace or organization to filter tasks on.
   * @option {String} [completed_since] Only return tasks that are either incomplete or that have been
   * completed since this time.
   * @option {String} [modified_since] Only return tasks that have been modified since the given time.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.findAll = function(
      params
  ) {
    var path = util.format('/tasks');
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Adds each of the specified followers to the task, if they are not already
   * following. Returns the complete, updated record for the affected task.
   * @param {Number} task The task to add followers to.
   * @param {Object} [data] Data for the request
   * @option {Array} followers An array of followers to add to the task.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.addFollowers = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/addFollowers', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Removes each of the specified followers from the task if they are
   * following. Returns the complete, updated record for the affected task.
   * @param {Number} task The task to remove followers from.
   * @param {Object} [data] Data for the request
   * @option {Array} followers An array of followers to remove from the task.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.removeFollowers = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/removeFollowers', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Returns a compact representation of all of the projects the task is in.
   * @param {Number} task The task to get projects on.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.projects = function(
      task,
      params
  ) {
    var path = util.format('/tasks/%d/projects', task);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Adds the task to the specified project, in the optional location
   * specified. If no location arguments are given, the task will be added to
   * the beginning of the project.
   * 
   * `addProject` can also be used to reorder a task within a project that
   * already contains it.
   * 
   * Returns an empty data block.
   * @param {Number} task The task to add to a project.
   * @param {Object} [data] Data for the request
   * @option {Number} project The project to add the task to.
   * @option {Number} [insertAfter] A task in the project to insert the task after, or `null` to
   * insert at the beginning of the list.
   * @option {Number} [insertBefore] A task in the project to insert the task before, or `null` to
   * insert at the end of the list.
   * @option {Number} [section] A section in the project to insert the task into. The task will be
   * inserted at the top of the section.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.addProject = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/addProject', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Removes the task from the specified project. The task will still exist
   * in the system, but it will not be in the project anymore.
   * 
   * Returns an empty data block.
   * @param {Number} task The task to remove from a project.
   * @param {Object} [data] Data for the request
   * @option {Number} project The project to remove the task from.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.removeProject = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/removeProject', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Returns a compact representation of all of the tags the task has.
   * @param {Number} task The task to get tags on.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.tags = function(
      task,
      params
  ) {
    var path = util.format('/tasks/%d/tags', task);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Adds a tag to a task. Returns an empty data block.
   * @param {Number} task The task to add a tag to.
   * @param {Object} [data] Data for the request
   * @option {Number} tag The tag to add to the task.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.addTag = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/addTag', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Removes a tag from the task. Returns an empty data block.
   * @param {Number} task The task to remove a tag from.
   * @param {Object} [data] Data for the request
   * @option {Number} tag The tag to remove from the task.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.removeTag = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/removeTag', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Returns a compact representation of all of the subtasks of a task.
   * @param {Number} task The task to get the subtasks of.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.subtasks = function(
      task,
      params
  ) {
    var path = util.format('/tasks/%d/subtasks', task);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Makes an existing task a subtask of another. Returns an empty data block.
   * @param {Number} task The task to add a subtask to.
   * @param {Object} [data] Data for the request
   * @option {Number} subtask The subtask to add to the task.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.addSubtask = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/subtasks', task);
    
    return this.dispatchPost(path, data);
  };

  /**
   * Returns a compact representation of all of the stories on the task.
   * @param {Number} task The task containing the stories to get.
   * @param {Object} [params] Parameters for the request
   * @return {Promise} The response from the API
   */
  Tasks.prototype.stories = function(
      task,
      params
  ) {
    var path = util.format('/tasks/%d/stories', task);
    
    return this.dispatchGetCollection(path, params);
  };

  /**
   * Adds a comment to a task. The comment will be authored by the
   * currently authenticated user, and timestamped when the server receives
   * the request.
   * 
   * Returns the full record for the new story added to the task.
   * @param {Number} task Globally unique identifier for the task.
   * @param {Object} [data] Data for the request
   * @option {String} text The plain text of the comment to add.
   * @return {Promise} The response from the API
   */
  Tasks.prototype.addComment = function(
      task,
      data
  ) {
    var path = util.format('/tasks/%d/stories', task);
    
    return this.dispatchPost(path, data);
  };


  return Tasks;
};