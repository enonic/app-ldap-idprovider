var authLib = require('/lib/xp/auth');
var commonLib = require('/lib/xp/common');

/**
 * Process group mappings for a user based on their LDAP groups
 * @param {Object} ldapUser - The LDAP user object
 * @param {Array} ldapGroups - Array of LDAP group DNs the user belongs to
 * @param {Object} idProviderConfig - The ID provider configuration
 * @param {Object} user - The XP user object
 * @param {String} idProviderKey - The ID provider key
 */
exports.processMappings = function(ldapUser, ldapGroups, idProviderConfig, user, idProviderKey) {
    if (!idProviderConfig.groupMappings || idProviderConfig.groupMappings.length === 0) {
        return;
    }

    var targetGroupKeys = [];

    // Process each mapping rule
    toArray(idProviderConfig.groupMappings).forEach(function(mapping) {
        if (matchesMapping(mapping, ldapUser, ldapGroups)) {
            var targetKey = mapping.target;
            if (targetKey) {
                targetGroupKeys.push(targetKey);

                // Add user to the target group
                try {
                    authLib.addMembers(targetKey, [user.key]);
                    log.debug('Added user [' + user.key + '] to group/role [' + targetKey + '] via mapping');
                } catch (e) {
                    log.error('Failed to add user [' + user.key + '] to group/role [' + targetKey + ']: ' + e);
                }
            }
        }
    });

    // Note: We don't automatically remove users from groups because:
    // 1. Users might be manually added to groups
    // 2. Default groups should be preserved
    // 3. DN-based groups are managed separately
    // To implement removal, we'd need to track which groups were added via mappings
};

/**
 * Check if a mapping rule matches the user's LDAP data
 * @param {Object} mapping - The mapping rule
 * @param {Object} ldapUser - The LDAP user object
 * @param {Array} ldapGroups - Array of LDAP group DNs
 * @returns {Boolean} - True if the mapping matches
 */
function matchesMapping(mapping, ldapUser, ldapGroups) {
    if (!mapping.source || !mapping.sourceValue) {
        return false;
    }

    var sourceValue = mapping.sourceValue.toLowerCase();

    if (mapping.source === 'ldapGroup') {
        // Match by group name (CN from DN)
        return ldapGroups.some(function(groupDn) {
            var groupName = extractCnFromDn(groupDn);
            return groupName && groupName.toLowerCase() === sourceValue;
        });
    } else if (mapping.source === 'ldapGroupDn') {
        // Match by full DN (case-insensitive)
        return ldapGroups.some(function(groupDn) {
            return groupDn.toLowerCase() === sourceValue;
        });
    }

    return false;
}

/**
 * Extract CN (Common Name) from a DN (Distinguished Name)
 * @param {String} dn - The distinguished name
 * @returns {String} - The CN value, or null if not found
 */
function extractCnFromDn(dn) {
    if (!dn) {
        return null;
    }

    // Simple CN extraction - split by comma and find CN component
    var components = dn.split(',');
    for (var i = 0; i < components.length; i++) {
        var component = components[i].trim();
        var parts = component.split('=', 2);
        if (parts.length === 2 && parts[0].toLowerCase() === 'cn') {
            return parts[1].trim();
        }
    }

    return null;
}

/**
 * Convert object to array if it isn't already
 * @param {*} object - The object to convert
 * @returns {Array} - Array representation
 */
function toArray(object) {
    if (!object) {
        return [];
    }
    if (object.constructor === Array) {
        return object;
    }
    return [object];
}
