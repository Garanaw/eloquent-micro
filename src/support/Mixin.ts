function _applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
              derivedCtor.prototype,
              name,
              Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
        });
    });
}

export default function (derived: any, constructors: any | any[]) {
    if (Array.isArray(constructors) === false) {
        constructors = [constructors];
    }

    return _applyMixins(derived, constructors);
};
