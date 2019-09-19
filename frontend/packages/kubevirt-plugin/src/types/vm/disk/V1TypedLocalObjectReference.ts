// tslint:disable
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.
 * @export
 * @interface V1TypedLocalObjectReference
 */
export interface V1TypedLocalObjectReference {
  /**
   * APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.
   * @type {string}
   * @memberof V1TypedLocalObjectReference
   */
  apiGroup: string;
  /**
   * Kind is the type of resource being referenced
   * @type {string}
   * @memberof V1TypedLocalObjectReference
   */
  kind: string;
  /**
   * Name is the name of resource being referenced
   * @type {string}
   * @memberof V1TypedLocalObjectReference
   */
  name: string;
}
