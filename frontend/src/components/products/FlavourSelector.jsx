'use client';

export default function FlavourSelector({ variants = [], selectedVariant, onSelectVariant }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Select Flavour / Variant
        </label>
        {selectedVariant && (
          <span className="text-xs font-semibold text-brand-green">
            {selectedVariant.flavour || selectedVariant.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isAvailable = (variant.inventory?.quantity || variant.stock || 10) > 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectVariant(variant)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-green bg-brand-green/5 ring-2 ring-brand-green'
                  : 'border-gray-200 hover:border-brand-gold/60 bg-white'
              } ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}`}
            >
              <p className="font-bold text-xs text-brand-charcoal truncate">
                {variant.flavour || variant.name}
              </p>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-gray-500">{variant.size || 'Regular Cup'}</span>
                {variant.price_adjustment ? (
                  <span className="font-bold text-brand-green">
                    +{variant.price_adjustment > 0 ? `₹${variant.price_adjustment}` : ''}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
